import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import xhr from 'xhr';

import log from '../lib/log';
import storage from '../lib/storage';
import dataURItoBlob from '../lib/data-uri-to-blob';
import {message} from 'antd';

import {
    showAlertWithTimeout,
    showStandardAlert
} from '../reducers/alerts';
import {setAutoSaveTimeoutId} from '../reducers/timeout';
import {setProjectUnchanged} from '../reducers/project-changed';
import {
    LoadingStates,
    autoUpdateProject,
    createProject,
    doneCreatingProject,
    doneUpdatingProject,
    getIsAnyCreatingNewState,
    getIsCreatingCopy,
    getIsCreatingNew,
    getIsManualUpdating,
    getIsRemixing,
    getIsShowingWithId,
    getIsShowingWithoutId,
    getIsUpdating,
    projectError
} from '../reducers/project-state';

/**
 * Higher Order Component to provide behavior for saving projects.
 * @param {React.Component} WrappedComponent the component to add project saving functionality to
 * @returns {React.Component} WrappedComponent with project saving functionality added
 *
 * <ProjectSaverHOC>
 *     <WrappedComponent />
 * </ProjectSaverHOC>
 */
const ProjectSaverHOC = function (WrappedComponent) {
    class ProjectSaverComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'leavePageConfirm',
                'tryToAutoSave'
            ]);
        }
        componentWillMount () {
            if (typeof window === 'object') {
                // Note: it might be better to use a listener instead of assigning onbeforeunload;
                // but then it'd be hard to turn this listening off in our tests
                window.onbeforeunload = e => this.leavePageConfirm(e);
            }
        }
        componentDidUpdate (prevProps) {
            if (this.props.projectChanged && !prevProps.projectChanged) {
                this.scheduleAutoSave();
            }
            if (this.props.isUpdating && !prevProps.isUpdating) {
                this.updateProjectToStorage();
            }
            if (this.props.isCreatingNew && !prevProps.isCreatingNew) {
                this.createNewProjectToStorage();
            }
            if (this.props.isCreatingCopy && !prevProps.isCreatingCopy) {
                this.createCopyToStorage();
            }
            if (this.props.isRemixing && !prevProps.isRemixing) {
                this.props.onRemixing(true);
                this.createRemixToStorage();
            } else if (!this.props.isRemixing && prevProps.isRemixing) {
                this.props.onRemixing(false);
            }

            // see if we should "create" the current project on the server
            //
            // don't try to create or save immediately after trying to create
            if (prevProps.isCreatingNew) return;
            // if we're newly able to create this project, create it!
            if (this.isShowingCreatable(this.props) && !this.isShowingCreatable(prevProps)) {
                this.props.onCreateProject();
            }

            // see if we should save/update the current project on the server
            //
            // don't try to save immediately after trying to save
            if (prevProps.isUpdating) return;
            // if we're newly able to save this project, save it!
            const becameAbleToSave = this.props.canSave && !prevProps.canSave;
            const becameShared = this.props.isShared && !prevProps.isShared;
            if (this.props.isShowingSaveable && (becameAbleToSave || becameShared)) {
                this.props.onAutoUpdateProject();
            }
        }
        componentWillUnmount () {
            this.clearAutoSaveTimeout();
            // Cant unset the beforeunload because it might no longer belong to this component
            // i.e. if another of this component has been mounted before this one gets unmounted
            // which happens when going from project to editor view.
            // window.onbeforeunload = undefined; // eslint-disable-line no-undefined
        }
        leavePageConfirm (e) {
            if (this.props.projectChanged) {
                // both methods of returning a value may be necessary for browser compatibility
                (e || window.event).returnValue = true;
                return true;
            }
            return; // Returning undefined prevents the prompt from coming up
        }
        clearAutoSaveTimeout () {
            if (this.props.autoSaveTimeoutId !== null) {
                clearTimeout(this.props.autoSaveTimeoutId);
                this.props.setAutoSaveTimeoutId(null);
            }
        }
        scheduleAutoSave () {
            if (this.props.isShowingSaveable && this.props.autoSaveTimeoutId === null) {
                const timeoutId = setTimeout(this.tryToAutoSave,
                    this.props.autoSaveIntervalSecs * 1000);
                this.props.setAutoSaveTimeoutId(timeoutId);
            }
        }
        tryToAutoSave () {
            if (this.props.projectChanged && this.props.isShowingSaveable) {
                this.props.onAutoUpdateProject();
            }
        }
        isShowingCreatable (props) {
            return props.canCreateNew && props.isShowingWithoutId;
        }
        updateProjectToStorage () {
            this.props.onShowSavingAlert();
            return this.storeProject(this.props.reduxProjectId)
                .then(() => {
                    // there's an http response object available here, but we don't need to examine
                    // it, because there are no values contained in it that we care about
                    this.props.onUpdatedProject(this.props.loadingState);
                    this.props.onShowSaveSuccessAlert();
                })
                .catch(err => {
                    // Always show the savingError alert because it gives the
                    // user the chance to download or retry the save manually.
                    this.props.onShowAlert('savingError');
                    this.props.onProjectError(err);
                });
        }
        createNewProjectToStorage () {
            return this.storeProject(null)
                .then(response => {
                    this.props.onCreatedProject(response.id.toString(), this.props.loadingState);
                })
                .catch(err => {
                    this.props.onShowAlert('creatingError');
                    this.props.onProjectError(err);
                });
        }
        createCopyToStorage () {
            this.props.onShowCreatingCopyAlert();
            return this.storeProject(null, {
                original_id: this.props.reduxProjectId,
                is_copy: 1,
                title: this.props.reduxProjectTitle
            })
                .then(response => {
                    this.props.onCreatedProject(response.id.toString(), this.props.loadingState);
                    this.props.onShowCopySuccessAlert();
                })
                .catch(err => {
                    this.props.onShowAlert('creatingError');
                    this.props.onProjectError(err);
                });
        }
        createRemixToStorage () {
            this.props.onShowCreatingRemixAlert();
            return this.storeProject(null, {
                original_id: this.props.reduxProjectId,
                is_remix: 1,
                title: this.props.reduxProjectTitle
            })
                .then(response => {
                    this.props.onCreatedProject(response.id.toString(), this.props.loadingState);
                    this.props.onShowRemixSuccessAlert();
                })
                .catch(err => {
                    this.props.onShowAlert('creatingError');
                    this.props.onProjectError(err);
                });
        }
        /**
         * storeProject:
         * @param  {number|string|undefined} projectId - defined value will PUT/update; undefined/null will POST/create
         * @return {Promise} - resolves with json object containing project's existing or new id
         * @param {?object} requestParams - object of params to add to request body
         */
        storeProject (projectId, requestParams) {
            requestParams = requestParams || {};
            this.clearAutoSaveTimeout();
            // Serialize VM state now before embarking on
            // the asynchronous journey of storing assets to
            // the server. This ensures that assets don't update
            // while in the process of saving a project (e.g. the
            // serialized project refers to a newer asset than what
            // we just finished saving).
            // const savedVMState = this.props.vm.toJSON();
            return this.props.vm.saveProjectSb3().then((code_blob) => {
                // 截图
                return new Promise((resolve, reject) => {
                    try {
                        this.props.vm.postIOData('video', {forceTransparentPreview: true});
                        this.props.vm.renderer.requestSnapshot(dataURI => {
                            this.props.vm.postIOData('video', {forceTransparentPreview: false});
                            // 继续上传
                            resolve({dataURI: dataURI, code:code_blob});
                        });
                        this.props.vm.renderer.draw();
                    } catch (e) {
                        log.error('Project thumbnail save error', e);
                        reject(e);
                        // This is intentionally fire/forget because a failure
                        // to save the thumbnail is not vitally important to the user.
                    }
                })
            }).then(({dataURI, code}) => {
                // 文件表单
                let form = new FormData();
                form.append('name', this.props.reduxProjectTitle);
                form.append('thumbnail', dataURI);
                form.append('project_id', projectId ? projectId:0);
                form.append('code', new Blob([code]));

                const opts = {
                    body: form,
                    withCredentials: true
                };
                const creatingProject = projectId === null || typeof projectId === 'undefined';
                let qs = queryString.stringify(requestParams);
                if (qs) qs = `?${qs}`;

                Object.assign(opts, {
                    method: 'post',
                    url: `/api/project/v1/upload${qs}`
                });

                return new Promise((resolve, reject) => {
                    xhr(opts, (err, response) => {
                        if (err) {
                            return reject(err);
                        }

                        if (response.statusCode == 403) {
                            return reject(new Error('别人的作品你只能看看哦~'));
                        } else if (response.statusCode != 200) {
                            return reject(new Error('网络开小差了, 再试试~'));
                        }

                        let body;
                        try {
                            // Since we didn't set json: true, we have to parse manually
                            body = JSON.parse(response.body);
                        } catch (e) {
                            return reject(e);
                        }
                        body.id = projectId;
                        if (creatingProject) {
                            body.id = body['content-name'];
                        }
                        resolve(body);
                    });
                });
            })
                .then(response => {
                    // 弹窗
                    message.info('上传成功', 1);
                    this.props.onSetProjectUnchanged();
                    const id = response.id.toString();
                    if (id && this.props.onUpdateProjectThumbnail) {
                        this.storeProjectThumbnail(id);
                    }
                    return response;
                })
                .catch(err => {
                    // 弹窗
                    message.error(err.message, 1);
                    log.error(err);
                    // throw err; // pass the error up the chain
                });
        }

        /**
         * Store a snapshot of the project once it has been saved/created.
         * Needs to happen _after_ save because the project must have an ID.
         * @param {!string} projectId - id of the project, must be defined.
         */
        storeProjectThumbnail (projectId) {
            try {
                this.props.vm.postIOData('video', {forceTransparentPreview: true});
                this.props.vm.renderer.requestSnapshot(dataURI => {
                    this.props.vm.postIOData('video', {forceTransparentPreview: false});
                    this.props.onUpdateProjectThumbnail(
                        projectId, dataURItoBlob(dataURI));
                });
                this.props.vm.renderer.draw();
            } catch (e) {
                log.error('Project thumbnail save error', e);
                // This is intentionally fire/forget because a failure
                // to save the thumbnail is not vitally important to the user.
            }
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                autoSaveTimeoutId,
                autoSaveIntervalSecs,
                isCreatingCopy,
                isCreatingNew,
                projectChanged,
                isAnyCreatingNewState,
                isManualUpdating,
                isRemixing,
                isShowingSaveable,
                isShowingWithId,
                isShowingWithoutId,
                isUpdating,
                loadingState,
                onAutoUpdateProject,
                onCreatedProject,
                onCreateProject,
                onProjectError,
                onRemixing,
                onSetProjectUnchanged,
                onShowAlert,
                onShowCopySuccessAlert,
                onShowRemixSuccessAlert,
                onShowCreatingCopyAlert,
                onShowCreatingRemixAlert,
                onShowSaveSuccessAlert,
                onShowSavingAlert,
                onUpdatedProject,
                onUpdateProjectThumbnail,
                reduxProjectId,
                reduxProjectTitle,
                setAutoSaveTimeoutId: setAutoSaveTimeoutIdProp,
                /* eslint-enable no-unused-vars */
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    isCreating={isAnyCreatingNewState}
                    {...componentProps}
                />
            );
        }
    }

    ProjectSaverComponent.propTypes = {
        autoSaveTimeoutId: PropTypes.number,
        canCreateNew: PropTypes.bool,
        canSave: PropTypes.bool,
        isAnyCreatingNewState: PropTypes.bool,
        isCreatingCopy: PropTypes.bool,
        isCreatingNew: PropTypes.bool,
        isManualUpdating: PropTypes.bool,
        isRemixing: PropTypes.bool,
        isShared: PropTypes.bool,
        isShowingSaveable: PropTypes.bool,
        isShowingWithId: PropTypes.bool,
        isShowingWithoutId: PropTypes.bool,
        isUpdating: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onAutoUpdateProject: PropTypes.func,
        onCreateProject: PropTypes.func,
        onCreatedProject: PropTypes.func,
        onProjectError: PropTypes.func,
        onRemixing: PropTypes.func,
        onShowAlert: PropTypes.func,
        onShowCopySuccessAlert: PropTypes.func,
        onShowCreatingCopyAlert: PropTypes.func,
        onShowCreatingRemixAlert: PropTypes.func,
        onShowRemixSuccessAlert: PropTypes.func,
        onShowSaveSuccessAlert: PropTypes.func,
        onShowSavingAlert: PropTypes.func,
        onUpdateProjectThumbnail: PropTypes.func,
        onUpdatedProject: PropTypes.func,
        projectChanged: PropTypes.bool,
        reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reduxProjectTitle: PropTypes.string,
        vm: PropTypes.instanceOf(VM).isRequired
    };
    ProjectSaverComponent.defaultProps = {
        autoSaveIntervalSecs: 120,
        onRemixing: () => {}
    };
    const mapStateToProps = (state, ownProps) => {
        const loadingState = state.scratchGui.projectState.loadingState;
        const isShowingWithId = getIsShowingWithId(loadingState);
        return {
            autoSaveTimeoutId: state.scratchGui.timeout.autoSaveTimeoutId,
            isAnyCreatingNewState: getIsAnyCreatingNewState(loadingState),
            isCreatingCopy: getIsCreatingCopy(loadingState),
            isCreatingNew: getIsCreatingNew(loadingState),
            isRemixing: getIsRemixing(loadingState),
            isShowingSaveable: ownProps.canSave && isShowingWithId,
            isShowingWithId: isShowingWithId,
            isShowingWithoutId: getIsShowingWithoutId(loadingState),
            isUpdating: getIsUpdating(loadingState),
            isManualUpdating: getIsManualUpdating(loadingState),
            loadingState: loadingState,
            projectChanged: state.scratchGui.projectChanged,
            reduxProjectId: state.scratchGui.projectState.projectId,
            reduxProjectTitle: state.scratchGui.projectTitle,
            vm: state.scratchGui.vm
        };
    };
    const mapDispatchToProps = dispatch => ({
        onAutoUpdateProject: () => dispatch(autoUpdateProject()),
        onCreatedProject: (projectId, loadingState) => dispatch(doneCreatingProject(projectId, loadingState)),
        onCreateProject: () => dispatch(createProject()),
        onProjectError: error => dispatch(projectError(error)),
        onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
        onShowAlert: alertType => dispatch(showStandardAlert(alertType)),
        onShowCopySuccessAlert: () => showAlertWithTimeout(dispatch, 'createCopySuccess'),
        onShowRemixSuccessAlert: () => showAlertWithTimeout(dispatch, 'createRemixSuccess'),
        onShowCreatingCopyAlert: () => showAlertWithTimeout(dispatch, 'creatingCopy'),
        onShowCreatingRemixAlert: () => showAlertWithTimeout(dispatch, 'creatingRemix'),
        onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, 'saveSuccess'),
        onShowSavingAlert: () => showAlertWithTimeout(dispatch, 'saving'),
        onUpdatedProject: (projectId, loadingState) => dispatch(doneUpdatingProject(projectId, loadingState)),
        setAutoSaveTimeoutId: id => dispatch(setAutoSaveTimeoutId(id))
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(ProjectSaverComponent);
};

export {
    ProjectSaverHOC as default
};

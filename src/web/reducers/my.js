const LOAD_PROJECT_LIST_DONE = 'my/LOAD_PROJECT_LIST_DONE';
const DEL_PROJECT = 'my/DEL_PROJECT';
const OPEN_SHARE_MODAL = 'my/OPEN_SHARE_MODAL';
const CLOSE_SHARE_MODAL = 'my/CLOSE_SHARE_MODAL';
const SET_SHARE = 'my/SET_SHARE'

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = {
    page: 1,
    size: 20,
    total: 0,
    projects: [],
    shareModalShown: false, // 微信二维码modal
    shareDataURI: '',
    canShare: 0, // 是否可分享
    projectID: 0, // 当前弹窗项目ID
    searchTitle: '',
    searchAuthor: '',
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LOAD_PROJECT_LIST_DONE:
        return Object.assign({}, state, {
            page: action.page, size: action.size, total: action.total, projects: action.projects,
            searchTitle: action.searchTitle, searchAuthor: action.searchAuthor,
        });
    case DEL_PROJECT:
        let projects = [];
        for (let i = 0; i < state.projects.length; ++i) {
            if (state.projects[i].id != action.proj_id) {
                projects.push(state.projects[i]);
            }
        }
        return Object.assign({}, state, {projects: projects});
    case OPEN_SHARE_MODAL:
       return Object.assign({}, state, {shareModalShown: true, shareDataURI: action.dataURI, projectID: action.projectID})
    case CLOSE_SHARE_MODAL:
       return Object.assign({}, state, {shareModalShown: false, shareDataURI: ''})
    case SET_SHARE:
        return Object.assign({}, state, {canShare: action.canShare})
    default:
        return state;
    }
};

const loadProjectListDone = (page, size, total, projects, searchAuthor, searchTitle) => ({
    type: LOAD_PROJECT_LIST_DONE,
    page: page,
    size: size,
    projects: projects,
    total: total,
    searchAuthor: searchAuthor,
    searchTitle: searchTitle,
})

const delProject = (proj_id) => ({
    type:  DEL_PROJECT,
    proj_id: proj_id,
})

const openShareModal = (projectID, dataURI) => ({
    type:  OPEN_SHARE_MODAL,
    dataURI: dataURI,
    projectID: projectID,
})

const closeShareModal = () => ({
    type: CLOSE_SHARE_MODAL,
})

const setShare = (canShare) => ({
    type:SET_SHARE,
    canShare: canShare
})

export {
    reducer as default,
    loadProjectListDone,
    delProject,
    openShareModal,
    closeShareModal,
    setShare,
};

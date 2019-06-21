const LOAD_PROJECT_LIST_DONE = 'my/LOAD_PROJECT_LIST_DONE';
const DEL_PROJECT = 'my/DEL_PROJECT';
const OPEN_SHARE_MODAL = 'my/OPEN_SHARE_MODAL';
const CLOSE_SHARE_MODAL = 'my/CLOSE_SHARE_MODAL';

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = {
    page: 0,
    size: 20,
    total: 0,
    projects: [],
    shareModalShown: false, // 微信二维码modal
    shareDataURI: '',
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LOAD_PROJECT_LIST_DONE:
        return Object.assign({}, state, {page: action.page, size: action.size, total: action.total, projects: action.projects});
    case DEL_PROJECT:
        let projects = [];
        for (let i = 0; i < state.projects.length; ++i) {
            if (state.projects[i].id != action.proj_id) {
                projects.push(state.projects[i]);
            }
        }
        return Object.assign({}, state, {projects: projects});
    case OPEN_SHARE_MODAL:
       return Object.assign({}, state, {shareModalShown: true, shareDataURI: action.dataURI})
    case CLOSE_SHARE_MODAL:
       return Object.assign({}, state, {shareModalShown: false, shareDataURI: ''})
    default:
        return state;
    }
};

const loadProjectListDone = (page, size, total, projects) => ({
    type: LOAD_PROJECT_LIST_DONE,
    page: page,
    size: size,
    projects: projects,
    total: total,
})

const delProject = (proj_id) => ({
    type:  DEL_PROJECT,
    proj_id: proj_id,
})

const openShareModal = (dataURI) => ({
    type:  OPEN_SHARE_MODAL,
    dataURI: dataURI,
})

const closeShareModal = () => ({
    type: CLOSE_SHARE_MODAL,
})

export {
    reducer as default,
    loadProjectListDone,
    delProject,
    openShareModal,
    closeShareModal,
};

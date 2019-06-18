const LOAD_PROJECT_LIST_DONE = 'my/LOAD_PROJECT_LIST_DONE';

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = {
    page: 0,
    size: 20,
    total: 0,
    projects: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LOAD_PROJECT_LIST_DONE:
        return Object.assign({}, state, {page: action.page, size: action.size, total: action.total, projects: action.projects});
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

export {
    reducer as default,
    loadProjectListDone,
};

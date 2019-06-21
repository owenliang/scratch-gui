const SET_PROJECT_META = 'h5/SET_PROJECT_META';

const initialState = {
    meta: {}
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT_META:
        return Object.assign({}, state, {meta: action.meta})
    default:
        return state;
    }
};

const setProjectMeta = meta => ({
    type: SET_PROJECT_META,
    meta: meta
});

export {
    reducer as default,
    initialState as h5InitialState,
    setProjectMeta
};

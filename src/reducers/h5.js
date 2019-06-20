const SET_PROJECT_AUTHOR = 'h5/SET_PROJECT_AUTHOR';

const initialState = {
    author: ''
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT_AUTHOR:
        return Object.assign({}, state, {author: action.author})
    default:
        return state;
    }
};

const setProjectAuthor = author => ({
    type: SET_PROJECT_AUTHOR,
    author: author
});

export {
    reducer as default,
    initialState as h5InitialState,
    setProjectAuthor
};

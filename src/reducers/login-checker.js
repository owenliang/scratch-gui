const SET_USERINFO = 'loginChecker/SET_USERINFO';

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = {};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_USERINFO:
        return action.userinfo;
    default:
        return state;
    }
};

const setUserinfo = userinfo => ({
    type: SET_USERINFO,
    userinfo: userinfo,
});

export {
    reducer as default,
    initialState as loginCheckerInitialState,
    setUserinfo
};

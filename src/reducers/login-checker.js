const SET_USERINFO = 'loginChecker/SET_USERINFO';
const SWITCH_LOGIN_FORM = 'loginChecker/OPEN_LOGIN_FORM'

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = {
    userinfo: {},
    openForm: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_USERINFO:  // 设置登录状态
        return Object.assign({}, state, {userinfo: action.userinfo});
    case SWITCH_LOGIN_FORM: // 登录框开关
        return Object.assign({}, state, {openForm: action.open});
    default:
        return state;
    }
};

const setUserinfo = userinfo => ({
    type: SET_USERINFO,
    userinfo: userinfo,
});

const openLoginForm = () => ({
    type: SWITCH_LOGIN_FORM,
    open: true,
})

const closeLoginForm = () => ({
    type: SWITCH_LOGIN_FORM,
    open: false,
})

export {
    reducer as default,
    initialState as loginCheckerInitialState,
    setUserinfo,
    openLoginForm,
    closeLoginForm
};

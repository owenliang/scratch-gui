const SET_USERINFO = 'loginChecker/SET_USERINFO';
const SWITCH_LOGIN_FORM = 'loginChecker/OPEN_LOGIN_FORM'
const SWITCH_ACCOUNT_MENU = 'loginChecker/SWITCH_ACCOUNT_MENU'
const LOGOUT = '/loginChecker/LOGOUT'

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = {
    userinfo: {},
    openForm: false,
    openAccountMenu: false,
    waitingLogout: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_USERINFO:  // 设置登录状态
        return Object.assign({}, state, {userinfo: action.userinfo});
    case SWITCH_LOGIN_FORM: // 登录框开关
        return Object.assign({}, state, {openForm: action.open});
    case SWITCH_ACCOUNT_MENU: // 帐号菜单
        return Object.assign({}, state, {openAccountMenu: action.open});
    case LOGOUT: // 登出
        return Object.assign({}, state, {waitingLogout: action.waiting});
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


const openAccountMenu= () => ({
    type: SWITCH_ACCOUNT_MENU,
    open: true,
})

const closeAccountForm = () => ({
    type: SWITCH_ACCOUNT_MENU,
    open: false,
})

// 开始登出
const startLogout = () => ({
    type: LOGOUT,
    waiting: true,
})

// 结束登出
const endLogout= () => ({
    type: LOGOUT,
    waiting: false,
})

export {
    reducer as default,
    initialState as loginCheckerInitialState,
    setUserinfo,
    openLoginForm,
    closeLoginForm,
    openAccountMenu,
    closeAccountForm,
    startLogout,
    endLogout
};

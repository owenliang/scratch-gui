const SET_USERINFO = 'web/loginChecker/SET_USERINFO';

const initialState = {
    userinfo: {},
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_USERINFO:  // 设置登录状态
        return Object.assign({}, state, {userinfo: action.userinfo});
    default:
        return state;
    }
};

const setUserinfo = userinfo => {
    return {
        type: SET_USERINFO,
        userinfo: userinfo,
    };
}


export {
    reducer as default,
    setUserinfo,
};

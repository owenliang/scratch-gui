const SET_PROJECT_META = 'h5/SET_PROJECT_META';
const SET_KEYBOARD_CHANGED = 'h5/SET_KEYBOARD_CHANGED';
const SET_IS_LOVE = 'h5/SET_IS_LOVE';
const SET_CLICK_LOVE = 'h5/SET_CLICK_LOVE';

const initialState = {
    meta: {},

    // 按键
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,

    // 是否已赞
    isLove: false,
    // 本次是否点赞
    clickLove: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT_META:
        return Object.assign({}, state, {meta: action.meta});
    case SET_KEYBOARD_CHANGED:
        let updated = {}
        if (action.key == 'ArrowUp') {
            updated['up'] = action.isDown;
        } else if (action.key == 'ArrowDown') {
            updated['down'] = action.isDown;
        } else if (action.key == 'ArrowLeft') {
            updated['left'] = action.isDown;
        } else if (action.key == 'ArrowRight') {
            updated['right'] = action.isDown;
        } else if (action.key == ' ') {
            updated['space'] = action.isDown;
        }
        return Object.assign({}, state, updated)
    case SET_IS_LOVE:
       return Object.assign({}, state, {isLove: action.isLove});
    case SET_CLICK_LOVE:
        return Object.assign({}, state, {clickLove:true, isLove: true});
    default:
        return state;
    }
};

const setProjectMeta = meta => ({
    type: SET_PROJECT_META,
    meta: meta
});

const setKeyPressed = (key) => ({
    type: SET_KEYBOARD_CHANGED,
    key: key,
    isDown: true
})

const setKeyUnPressed = (key) => ({
    type: SET_KEYBOARD_CHANGED,
    key: key,
    isDown: false
})

const setLove = (isLove) => ({
    type: SET_IS_LOVE,
    isLove: isLove,
})

const setClickLove = () => ({
    type: SET_CLICK_LOVE,
})

export {
    reducer as default,
    initialState as h5InitialState,
    setProjectMeta,
    setKeyPressed,
    setKeyUnPressed,
    setLove,
    setClickLove
};

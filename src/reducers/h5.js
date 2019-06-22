const SET_PROJECT_META = 'h5/SET_PROJECT_META';
const SET_KEYBOARD_CHANGED = 'h5/SET_KEYBOARD_CHANGED';

const initialState = {
    meta: {},

    // 按键
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
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

export {
    reducer as default,
    initialState as h5InitialState,
    setProjectMeta,
    setKeyPressed,
    setKeyUnPressed
};

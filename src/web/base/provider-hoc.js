import React from 'react';
import {combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import myReducer from '../reducers/my';
import loginCheckerReducer from '../reducers/login-checker'

// 提供Redux状态
const ProviderHoc = function (WrappedComponent) {
    class ProviderWrapper extends React.Component {
        constructor (props) {
            super(props);

            // 所有的reducer
            let reducers = {
                'my': myReducer,
                'loginChecker': loginCheckerReducer,
            }
            let reducer = combineReducers(reducers);

            // redux store
            this.store = createStore(
                reducer,
            );
        }

        render() {
            return (
                <Provider store={this.store}>
                    <WrappedComponent {...this.props} />
                </Provider>
            )
        }
    }
    return ProviderWrapper;
}


export default ProviderHoc;

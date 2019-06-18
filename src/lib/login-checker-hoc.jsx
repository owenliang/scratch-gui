import React from 'react';
import xhr from 'xhr';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {setUserinfo, closeLoginForm} from '../reducers/login-checker';
import LoginForm from '../components/login/login.jsx';

// 强制校验登录的HOC
const LoginCheckerHOC = function (WrappedComponent) {
    class LoginCheckerWrapper extends React.Component {
        constructor (props) {
            super(props);
        }

        componentDidMount() {
            console.log('LoginCheckerWrapper');

            // 请求用户登录状态
            const opts = {
                method: 'get',
                url: `/api/user/v1/userinfo`,
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            xhr(opts, (err, response) => {
                if (!err) {
                    let r = JSON.parse(response['body']);

                    if (r['error_code'] == 0) {
                        this.props.onUpdateUserInfo(r['data']);
                        return;
                    }
                }
            });
        }

        render() {
            const {onUpdateUserInfo, onCloseLoginForm, userinfo, openForm, ...otherProps} = this.props;

            return (
                <React.Fragment>
                    <LoginForm openForm={openForm} onCloseLoginForm={onCloseLoginForm} onUpdateUserInfo={onUpdateUserInfo}></LoginForm>
                    <WrappedComponent {...otherProps}/>
                </React.Fragment>
            );
        }
    }

    LoginCheckerWrapper.propTypes = {
        onUpdateUserInfo: PropTypes.func,
        userinfo: PropTypes.object,
        openForm: PropTypes.bool,
        onCloseLoginForm: PropTypes.func,
    };

    LoginCheckerWrapper.defaultProps = {

    };

    const mapStateToProps = state => {
        let loginChecker = state.scratchGui.loginChecker;

        return {
            userinfo: loginChecker.userinfo,
            openForm: loginChecker.openForm,
        };
    }

    const mapDispatchToProps = dispatch => ({
        onUpdateUserInfo: (userinfo) => {
            dispatch(setUserinfo(userinfo));
        },
        onCloseLoginForm: () => {
            dispatch(closeLoginForm());
        }
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoginCheckerWrapper);
}

export default LoginCheckerHOC;

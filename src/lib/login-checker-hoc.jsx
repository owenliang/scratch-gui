import React from 'react';
import xhr from 'xhr';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {setUserinfo, closeLoginForm, endLogout} from '../reducers/login-checker';
import LoginForm from '../components/login/login.jsx';

// 强制校验登录的HOC
const LoginCheckerHOC = function (WrappedComponent) {
    class LoginCheckerWrapper extends React.Component {
        constructor (props) {
            super(props);
        }

        componentDidMount() {
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

        componentDidUpdate(prevProps) {
            let me = this;

            // 触发了登出
            if (!prevProps.waitingLogout && this.props.waitingLogout) {
                const opts = {
                    method: 'get',
                    url: `/api/user/v1/logout`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                xhr(opts, (err, response) => {
                    // 注销本地cookie
                    me.delete_cookie('kids123code_sess');
                    // 清除登出状态
                    me.props.endLogout();
                    // 清除会话状态
                    me.props.onUpdateUserInfo({});
                });
            }
        }

        delete_cookie( name ) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        render() {
            const {
                onUpdateUserInfo,
                onCloseLoginForm,
                userinfo,
                openForm,
                endLogout,
                waitingLogout,
                ...otherProps
            } = this.props;

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
        waitingLogout: PropTypes.bool,
        endLogout: PropTypes.func,
    };

    LoginCheckerWrapper.defaultProps = {

    };

    const mapStateToProps = state => {
        let loginChecker = state.scratchGui.loginChecker;

        return {
            userinfo: loginChecker.userinfo,
            openForm: loginChecker.openForm,
            waitingLogout: loginChecker.waitingLogout,
        };
    }

    const mapDispatchToProps = dispatch => ({
        onUpdateUserInfo: (userinfo) => dispatch(setUserinfo(userinfo)),
        onCloseLoginForm: () => dispatch(closeLoginForm()),
        endLogout: () => dispatch(endLogout()),
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoginCheckerWrapper);
}

export default LoginCheckerHOC;

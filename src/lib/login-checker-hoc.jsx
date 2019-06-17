import React from 'react';
import xhr from 'xhr';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {setUserinfo} from '../reducers/login-checker';

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
            const {onUpdateUserInfo, userinfo, ...otherProps} = this.props;

            return (<WrappedComponent {...otherProps}/>);
        }
    }

    LoginCheckerWrapper.propTypes = {
        onUpdateUserInfo: PropTypes.func,
        userinfo: PropTypes.object,
    };

    LoginCheckerWrapper.defaultProps = {

    };

    const mapStateToProps = state => ({
        userinfo: state.scratchGui.loginChecker,
    });

    const mapDispatchToProps = dispatch => ({
        onUpdateUserInfo: (userinfo) => {
            dispatch(setUserinfo(userinfo));
        }
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoginCheckerWrapper);
}

export default LoginCheckerHOC;

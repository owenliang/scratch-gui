import React from 'react';
import xhr from 'xhr';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import {setUserinfo} from '../reducers/login-checker';

// 登录状态HOC
const WebLoginCheckerHOC = function (WrappedComponent) {
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
                    } else {
                        window.location.href = 'https://class.kids123code.com/local/oauth/login.php?client_id=code.kids123code.com&response_type=code';
                    }
                }
            });
        }

        render() {
            const {
                onUpdateUserInfo,
                ...otherProps
            } = this.props;

            return (
                <WrappedComponent {...otherProps}/>
            );
        }
    }

    LoginCheckerWrapper.propTypes = {

    };

    LoginCheckerWrapper.defaultProps = {

    };

    const mapStateToProps = state => ({
    })

    const mapDispatchToProps = dispatch => ({
        onUpdateUserInfo: (userinfo) => dispatch(setUserinfo(userinfo)),
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoginCheckerWrapper);
}

export default WebLoginCheckerHOC;

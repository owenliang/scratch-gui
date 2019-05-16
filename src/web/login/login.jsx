import React, {Fragment} from 'react';
import LoginForm from './login-form.jsx';
import ReactDOM from 'react-dom';
import loginCover from './login-cover.jpg';
import styles from './login.css';


// 登录页
class Login extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Fragment>
                <img id={styles.coverImg} src={loginCover}/>
                <div id={styles.loginContainer}>
                    <LoginForm></LoginForm>
                </div>
            </Fragment>
        )
    }
}

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
ReactDOM.render(<Login />, appTarget);

import React, {Fragment} from 'react';
import styles from './login.css';
import ReactDOM from 'react-dom';
import loginCover from './login-cover.jpg';

// 登录页
class Login extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Fragment>
                <img id={styles.coverImg} src={loginCover}/>
                <h1>hello</h1>
            </Fragment>
        )
    }
}

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
ReactDOM.render(<Login />, appTarget);

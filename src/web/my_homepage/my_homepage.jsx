import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import styles from './my_homepage.css';

// 我的个人主页
class MyHomepage extends React.Component {
    constructor (props) {
        super(props);

    }

    render () {
        return (
            <Fragment>

            </Fragment>
        )
    }
}

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
ReactDOM.render(<MyHomepage />, appTarget);

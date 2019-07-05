import styles from './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import logo123 from '../../src/components/menu-bar/logo123.png';

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

class IndexWrapper extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount() {
        import(/* webpackChunkName: "scratch_index" */ './index.jsx').then(
            (module) => {
                module.default(appTarget);
            }
        )
    }

    render () {
        return (
            <React.Fragment>
                <div className={styles['async-loading-box']}>
                    <img src={logo123}/>
                    <div className={styles['async-loading-words']}>努力加载中...</div>
                    <div className={styles['async-loading-words']}>美好的事情总是值得等待的!</div>
                </div>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<IndexWrapper/>, appTarget);

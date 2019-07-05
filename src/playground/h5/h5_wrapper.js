import React from 'react';
import ReactDOM from 'react-dom';
import logo123 from '../../../src/components/menu-bar/logo123.png';
import styles from '../loading_wrapper.css';

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);

class H5Wrapper extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount() {
        import(/* webpackChunkName: "h5_index" */ './h5.jsx').then(
            (module) => {
                ReactDOM.render(<module.default isPlayerOnly></module.default>, appTarget);
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

ReactDOM.render(<H5Wrapper/>, appTarget);

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {compose} from 'redux';
import HashParserHOC from '../../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../../lib/app-state-hoc.jsx';
import TitledHOC from '../../lib/titled-hoc.jsx';

import ConnectedPlayer from '../player.jsx';
import styles from './h5.css';
import logo123 from '../../components/menu-bar/logo123.png';
import qrcode from './qrcode.jpg';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

class H5 extends React.Component {
    componentDidMount() {}

    render() {
      return (
          <div className={styles.h5Container}>
              <div className={styles.header}>
                  <img src={logo123} className={styles.logo} />
              </div>
              <div className={styles.projectInfo}>
                  <div>
                      <span className={styles.projectTitle}>{`《${this.props.projectTitle}》`}</span>
                  </div>
                  <div>
                      <span className={styles.projectAuthor}>创作者：{this.props.projectAuthor}</span>
                  </div>
              </div>
              <ConnectedPlayer/>
              <div className={styles.footer}>
                  <div>
                      <img src={qrcode} className={styles.qrcode}/>
                  </div>
                  <div>
                      <span>青岛市市南区一二三编程培训学校有限责任公司@2019</span>
                  </div>
              </div>
          </div>
      )
    }
}

H5.propTypes = {

};

const mapStateToProps = state => {
    return {
        projectTitle: state.scratchGui.projectTitle ? state.scratchGui.projectTitle : '无名作品',
        projectAuthor: state.scratchGui.h5.author ? state.scratchGui.h5.author : '无名作者',
    }
};

const mapDispatchToProps = dispatch => ({

});

const ConnectedH5 = connect(
    mapStateToProps,
    mapDispatchToProps
)(H5);

const WrappedH5 = compose(
    AppStateHOC,
    HashParserHOC,
    TitledHOC
)(ConnectedH5);

const appTarget = document.createElement('div');
document.body.appendChild(appTarget);

ReactDOM.render(<WrappedH5 isPlayerOnly />, appTarget);

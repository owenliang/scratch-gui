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
import wx from 'weixin-js-sdk';
import xhr from 'xhr';
import queryString from 'query-string';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

class H5 extends React.Component {

    // 拉取微信签名，初始化wx sdk
    fetchSign() {
        let params = {url: 'https://scratch.kids123code.com/h5.html'};
        const opts = {
            method: 'get',
            url: `/api/wx/v1/js_sign?${queryString.stringify(params)}`,
            headers: {
                'Content-Type': 'application/json'
            },
        };
        xhr(opts, (err, response) => {
            if (response.statusCode == 200) {
                let r = JSON.parse(response['body']);

                // 调用微信接口config
                r['debug'] = true;
                r['jsApiList'] = ['updateAppMessageShareData'];
                wx.config(r);

                // 成功回调
                wx.ready(() => {
                    console.log('wx ready');
                    this.updateWxShareData();
                });

                // 失败忽略
                wx.error((res) => {
                    console.log('wx error' + res);
                });
            }
        });
    }

    updateWxShareData() {
        // 分享给朋友
        wx.updateAppMessageShareData({
            title: `快来玩${this.props.projectAuthor}的《${this.props.projectTitle}》`, // 分享标题
            desc: `${this.props.projectAuthor}创作的scratch小游戏，快来玩吧~`, // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://assets.scratch.kids123code.com/wx_share.png', // 分享图标
            success: function () {
                // 设置成功
                console.log('wx分享给朋友更新完成');
            },
        })
        // 分享到朋友圈
        wx.updateTimelineShareData({
            title: `快来玩${this.props.projectAuthor}的《${this.props.projectTitle}》`, // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://assets.scratch.kids123code.com/wx_share.png', // 分享图标
            success: function () {
                // 设置成功
                console.log('wx分享到朋友圈更新完成');
            },
        })
    }

    componentDidMount() {
        // 服务端JS签名
        this.fetchSign();
    }

    componentDidUpdate(prevProps) {
        // 标题/作者更新，重新设置分享
        if (prevProps.projectTitle != this.props.projectTitle || prevProps.projectAuthor != this.props.projectAuthor) {
            this.updateWxShareData();
        }
    }

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

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
import qrcode from './shiting.png';
import wx from 'weixin-js-sdk';
import xhr from 'xhr';
import queryString from 'query-string';
import classNames from 'classnames';

import {setKeyPressed, setKeyUnPressed, setLove, clickLove, setClickLove} from '../../reducers/h5';
import bindAll from "lodash.bindall";
import analytics from '../../lib/analytics';
import loveImg from './love.svg';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

// Register "base" page view
analytics.pageview('/h5.html');


class H5 extends React.Component {

    constructor(props) {
        super(props);

        bindAll(this, [
            'handleUpStart',
            'handleUpEnd',
            'handleDownStart',
            'handleDownEnd',
            'handleLeftStart',
            'handleLeftEnd',
            'handleRightStart',
            'handleRightEnd',
            'handleSpaceStart',
            'handleSpaceEnd',
            'handleClickLove',
        ]);
    }

    // 拉取微信签名，初始化wx sdk
    fetchSign() {
        let params = {url: window.location.href.split('#')[0]};
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
                r['debug'] = false;
                r['jsApiList'] = ['updateAppMessageShareData', 'updateTimelineShareData'];
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
        let projectThumbnail =  this.props.projectThumbnail ? `https:${this.props.projectThumbnail}` : 'https://assets2-scratch.kids123code.com/wx_share.png';

        // 分享给朋友
        wx.updateAppMessageShareData({
            title: `图形化编程作品 《${this.props.projectTitle}》 -  123少儿编程`, // 分享标题
            desc: `编程达人${this.props.projectAuthor}创作的小游戏，快来玩吧~`, // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: projectThumbnail, // 分享图标
            success: function () {
                // 设置成功
                console.log('wx分享给朋友更新完成');
            },
        })
        // 分享到朋友圈
        wx.updateTimelineShareData({
            title: `图形化编程作品 《${this.props.projectTitle}》 -  123少儿编程`, // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: projectThumbnail, // 分享图标
            success: function () {
                // 设置成功
                console.log('wx分享到朋友圈更新完成');
            },
        })
    }

    adjustWidth() {
        this.width = window.innerWidth;
        if (this.width > 640) {
            this.width = 640;
        }
        // 不要填满屏幕宽度
        this.width -= 5;
    }

    // 获取点赞状态
    fetchLoveStatus() {
        let params = {project_id: this.props.projectId};
        const opts = {
            method: 'get',
            url: `/api/project/v1/is_love?${queryString.stringify(params)}`,
            headers: {
                'Content-Type': 'application/json'
            },
        };
        xhr(opts, (err, response) => {
            if (response.statusCode == 200) {
                let r = JSON.parse(response['body']);
                this.props.setLove(r['data']['love']);
            }
        });
    }

    // 点赞
    handleClickLove() {
        if (this.props.isLove) {
            return;
        }

        this.props.setClickLove();

        let params = {project_id: this.props.projectId};
        const opts = {
            method: 'get',
            url: `/api/project/v1/love?${queryString.stringify(params)}`,
            headers: {
                'Content-Type': 'application/json'
            },
        };
        xhr(opts, (err, response) => {});
    }

    componentDidMount() {
        // 服务端JS签名
        this.fetchSign();
        // 获取点赞状态
        if (this.props.projectId) {
            this.fetchLoveStatus();
        }

        window.addEventListener('contextmenu', function(e) {e.preventDefault();})
    }

    componentDidUpdate(prevProps) {
        // 标题/作者更新，重新设置分享
        if (prevProps.projectTitle != this.props.projectTitle || prevProps.projectAuthor != this.props.projectAuthor) {
            this.updateWxShareData();
        }

        // 获取点赞状态
        if (prevProps.projectId != this.props.projectId && this.props.projectId) {
            this.fetchLoveStatus();
        }
    }

    keyboardEvent(key, isDown) {
        let event = {
            key: key,
            isDown: isDown,
        }

        if (key == 'ArrowUp') {
            event.keyCode = 38;
        } else if (key == 'ArrowDown') {
            event.keyCode = 40;
        } else if (key == 'ArrowLeft') {
            event.keyCode = 37;
        } else if (key == 'ArrowRight') {
            event.keyCode = 39;
        } else if (key == ' ') {
            event.keyCode = 32;
        }
        return event;
    }

    handleKeyDown (ev, key) {
        let vmEvent = this.keyboardEvent(key, true);
        this.props.vm.postIOData('keyboard', vmEvent);
    }
    handleKeyUp (ev, key) {
        let vmEvent = this.keyboardEvent(key, false);
        this.props.vm.postIOData('keyboard', vmEvent);
    }

    handleUpStart(ev) {
        this.props.setKeyPressed('ArrowUp');
        this.handleKeyDown(ev, 'ArrowUp');
    }
    handleUpEnd(ev) {
        this.props.setKeyUnPressed('ArrowUp');
        this.handleKeyUp(ev, 'ArrowUp');
    }

    handleDownStart(ev) {
        this.props.setKeyPressed('ArrowDown');
        this.handleKeyDown(ev, 'ArrowDown');
    }
    handleDownEnd(ev) {
        this.props.setKeyUnPressed('ArrowDown');
        this.handleKeyUp(ev, 'ArrowDown');
    }

    handleLeftStart(ev) {
        this.props.setKeyPressed('ArrowLeft');
        this.handleKeyDown(ev, 'ArrowLeft');
    }
    handleLeftEnd(ev) {
        this.props.setKeyUnPressed('ArrowLeft');
        this.handleKeyUp(ev, 'ArrowLeft');
    }

    handleRightStart(ev) {
        this.props.setKeyPressed('ArrowRight');
        this.handleKeyDown(ev, 'ArrowRight');
    }
    handleRightEnd(ev) {
        this.props.setKeyUnPressed('ArrowRight');
        this.handleKeyUp(ev, 'ArrowRight');
    }

    handleSpaceStart(ev) {
        this.props.setKeyPressed(' ');
        this.handleKeyDown(ev, ' ');
    }
    handleSpaceEnd(ev) {
        this.props.setKeyUnPressed(' ');
        this.handleKeyUp(ev, ' ');
    }

    render() {
        this.adjustWidth();

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
              <div className={styles.controllerContainer} style={{width: `${this.width}px`}}>
                  <div className={styles.directionBtnContainer}>
                      <div
                          onTouchStart={this.handleUpStart}
                          onTouchEnd={this.handleUpEnd}
                          onTouchCancel={this.handleUpEnd}
                          onMouseDown={this.handleUpStart}
                          onMouseUp={this.handleUpEnd}
                          className={classNames(styles.upBtn, styles.directionBtns, {[styles.active]: this.props.up})}
                      />
                      <div
                           onTouchStart={this.handleDownStart}
                           onTouchEnd={this.handleDownEnd}
                           onTouchCancel={this.handleDownEnd}
                           onMouseDown={this.handleDownStart}
                           onMouseUp={this.handleDownEnd}
                           className={classNames(styles.downBtn, styles.directionBtns, {[styles.active]: this.props.down})}
                      />
                      <div
                          onTouchStart={this.handleLeftStart}
                          onTouchEnd={this.handleLeftEnd}
                          onTouchCancel={this.handleLeftEnd}
                          onMouseDown={this.handleLeftStart}
                          onMouseUp={this.handleLeftEnd}
                           className={classNames(styles.leftBtn, styles.directionBtns, {[styles.active]: this.props.left})}
                      />
                      <div
                          onTouchStart={this.handleRightStart}
                          onTouchEnd={this.handleRightEnd}
                          onTouchCancel={this.handleRightEnd}
                          onMouseDown={this.handleRightStart}
                          onMouseUp={this.handleRightEnd}
                          className={classNames(styles.rightBtn, styles.directionBtns, {[styles.active]: this.props.right})}
                      />
                  </div>
                  <div
                      onTouchStart={this.handleSpaceStart}
                      onTouchEnd={this.handleSpaceEnd}
                      onTouchCancel={this.handleSpaceEnd}
                      onMouseDown={this.handleSpaceStart}
                      onMouseUp={this.handleSpaceEnd}
                       className={classNames(styles.spaceBtn, {[styles.active]: this.props.space})}
                  ></div>
              </div>
              {
                  this.props.projectDesc ? (
                      <div className={styles['description-container']} style={{width: `${this.width}px`}}>
                      <div className={styles['description-title']}>
                          操作说明：
                      </div>
                      <div className={styles['description-content']}>
                          {this.props.projectDesc}
                      </div>
                  </div>) : null
              }
              <div className={styles['love-container']}>
                  <div className={classNames(styles['love-btn'], {[styles.active]: this.props.isLove})} onClick={this.handleClickLove}>
                      <img src={loveImg} className={styles['love-img']} />
                  </div>
                  <div  className={styles['love-count-container']}>
                    <div className={styles['love-count']}>{this.props.love + (this.props.clickLove ? 1 : 0)}</div>
                  </div>
                  <div className={styles['love-tips']}>点赞鼓励一下</div>
              </div>
              <div className={styles.footer}>
                  <div>
                      <img src={qrcode} className={styles.qrcode}/>
                  </div>
                  <div>
                      <span>青岛市市南区一二三编程培训学校有限责任公司@2019</span>
                  </div>
              </div>
          </div>
        );
    }
}

H5.propTypes = {

};

const mapStateToProps = state => {
    return {
        projectId: state.scratchGui.projectState.projectId ? state.scratchGui.projectState.projectId : 0,
        projectTitle: state.scratchGui.projectTitle ? state.scratchGui.projectTitle : '无名作品',
        projectAuthor: state.scratchGui.h5.meta.author ? state.scratchGui.h5.meta.author : '无名作者',
        projectThumbnail:  state.scratchGui.h5.meta.thumbnail ? state.scratchGui.h5.meta.thumbnail : '',
        projectDesc: state.scratchGui.h5.meta.description ? state.scratchGui.h5.meta.description: '',
        vm: state.scratchGui.vm,
        up: state.scratchGui.h5.up,
        down: state.scratchGui.h5.down,
        left: state.scratchGui.h5.left,
        right: state.scratchGui.h5.right,
        space: state.scratchGui.h5.space,
        love: state.scratchGui.h5.meta.love ? state.scratchGui.h5.meta.love : 0,
        isLove: state.scratchGui.h5.isLove ? true: false,
        clickLove: state.scratchGui.h5.clickLove,
    }
};

const mapDispatchToProps = dispatch => ({
    setKeyPressed: (key) => dispatch(setKeyPressed(key)),
    setKeyUnPressed: (key) => dispatch(setKeyUnPressed(key)),
    setLove: (isLove) => dispatch(setLove(isLove)),
    setClickLove: () => dispatch(setClickLove()),
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

export default WrappedH5;

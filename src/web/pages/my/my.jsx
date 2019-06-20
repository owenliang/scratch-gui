import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import styles from './my.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import logo123 from '../../../components/menu-bar/logo123.png';
import { Table, Divider, Tag, Button, message } from 'antd';
import xhr from 'xhr';
import queryString from 'query-string';
import ProviderHoc from '../../base/provider-hoc';
import {loadProjectListDone, delProject} from '../../reducers/my';
import connect from 'react-redux/es/connect/connect';
import {compose} from 'redux';
import  WebLoginCheckerHOC from '../../base/web-login-checker-hoc';

const { Header, Content, Footer } = Layout;

// 我的个人主页
class My extends React.Component {
    constructor (props) {
        super(props);

        this.columns = [
            {
                title: '截图',
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                render: (text) => (
                    <img src={text} className={styles.thumbnail}/>
                )
            },
            {
                title: '标题',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                key: 'update_time',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                        <a href="javascript:void(0);" onClick={() => {window.location=`/#${record['id']}`;}}>继续创作</a>
                        <Divider type="vertical" />
                        <a href="javascript:void(0)">分享微信</a>
                        <Divider type="vertical" />
                         <a href="javascript:void(0)" onClick={() => this.handleDelProject(record['id'])}>删除作品</a>
                    </span>
                )
            }
        ];
    }

    handleDelProject(proj_id) {
        if (!confirm('确认要删除吗')) {
            return;
        }

        let params = {proj_id: proj_id}

        var formData = new FormData();
        formData.append('proj_id', proj_id);

        const opts = {
            method: 'post',
            url: `/api/project/v1/del_project`,
            body: formData,
        };
        xhr(opts, (err, response) => {
            // 需要重新从当前列表中删掉这个项目
            if (response.statusCode == 200) {
                this.props.delProject(proj_id);
            } else {
                message.error('网络异常', 1);
            }
        });
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        // 发起第一页的请求
        this.loadPage(1, 20);
    }

    loadPage(page, size) {
        let params = {page: page, size: size}

        const opts = {
            method: 'get',
            url: `/api/project/v1/my_list?${queryString.stringify(params)}`,
            headers: {
                'Content-Type': 'application/json'
            },
        };
        xhr(opts, (err, response) => {
            let r = JSON.parse(response['body']);
            if (r['error_code'] != 0) {
                return;
            }
            let data = r['data'];
            this.props.loadProjectListDone(params['page'], params['size'], data['total'], data['rows']);
        });
    }

    render () {
        let datasource = []
        for (var i = 0; i < this.props.projects.length; ++i) {
            let proj = this.props.projects[i];
            let item = Object.assign({}, proj, {key: proj['id']});
            datasource.push(item);
        }

        return (
            <Layout>
                <Header className={styles.header}>
                    <img className={styles.logo} src={logo123} />
                    <div className={styles.account}>{this.props.userinfo['username'] ? this.props.userinfo['last_name'] + this.props.userinfo['first_name'] : ''}</div>
                </Header>
                <Content className={styles.content} >
                    <div className={styles['inner-content']}>
                        <div  className={styles.toolbar}>
                            <Button type="primary" onClick={()=>{window.location='/';}}>前去创作</Button>
                        </div>
                        <Table columns={this.columns}
                               dataSource={datasource}
                               pagination={{defaultPageSize: 20, current: this.props.page, pageSize: this.props.size, total: this.props.total}}
                               onChange={(page) => {this.loadPage(page.current, page.pageSize);}}
                        />
                    </div>
                </Content>
                <Footer className={styles.footer}>青岛市市南区一二三编程培训学校有限责任公司@2019</Footer>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        page:  state.my.page,
        size: state.my.size,
        total: state.my.total,
        projects: state.my.projects,
        userinfo: state.loginChecker.userinfo,
    };
}

const mapDispatchToProps = dispatch => ({
    loadProjectListDone: (page, size, total, projects) => dispatch(loadProjectListDone(page, size, total, projects)),
    delProject: (proj_id) => dispatch(delProject(proj_id)),
});

let connectedMy = connect(
    mapStateToProps,
    mapDispatchToProps
)(My);

// 挂载各种HOC
const WrappedMy = compose(
    ProviderHoc,
    WebLoginCheckerHOC,
)(connectedMy);

let container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<WrappedMy />, container);

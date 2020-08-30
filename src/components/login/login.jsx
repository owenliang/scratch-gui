import React from 'react';
import styles from './login.css';
import {Form, Input, Icon, Button, message, Divider, Modal} from 'antd';
import axios from 'axios';
import CatImg from './cat.png';
import Logo123 from './logo123.png';

// 登录页
class Login extends React.Component {
    constructor (props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = new URLSearchParams();
                params.append('username', values['username']);
                params.append('password', values['password']);
                axios.post('/api/user/v1/login', params).then(response => {
                    response = response['data'];
                    if (response['error_code'] != 0) {
                        message.error(response['error_msg'], 1);
                    } else {
                        this.props.onUpdateUserInfo(response['data']);
                        this.props.onCloseLoginForm();
                    }
                }, error => {
                    message.error('服务器异常', 1)
                })
            }
        });
    };

    handleCancel(event) {
        this.props.onCloseLoginForm();
    }

    render () {
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal
                visible={this.props.openForm}
                footer={null}
                onCancel={this.handleCancel}
                maskClosable={true}
                width={400}
            >
                <Form onSubmit={this.handleSubmit}>
                    <div id={styles.loginHead}>
                        <img src={Logo123} />
                        <span>欢迎回来，123的小伙伴~</span>
                    </div>
                    <Divider/>
                    <Form.Item>
                        {
                            getFieldDecorator('username', {rules: [{required: true, message: '用户名必填'}]})(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="用户名"
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password', {rules: [{required: true, message: '密码必填'}]})(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />
                            )
                        }
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className={styles.loginButton}>
                        登录
                    </Button>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Login);

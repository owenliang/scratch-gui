import React from 'react';
import styles from './login.css';
import {Form, Input, Icon, Button, message, Divider} from 'antd';
import axios from 'axios';
import CatImg from './cat.png';

// 登录页
class LoginForm extends React.Component {
    constructor (props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = new URLSearchParams();
                params.append('username', values['username']);
                params.append('password', values['password']);
                axios.post('/api/user/v1/login', params).then(response => {
                    if (response['data']['error_code'] != 0) {
                        message.error(response['data']['error_msg']);
                    } else {
                        window.location = '/';
                    }
                }, error => {
                    message.error('服务器异常')
                })
            }
        });
    };

    render () {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <div id={styles.loginHead}>
                    <img src={CatImg} />
                    <span>123少儿编程</span>
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
        )
    }
}

export default Form.create()(LoginForm);

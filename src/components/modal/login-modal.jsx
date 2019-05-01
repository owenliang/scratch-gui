import { Form, Icon, Input, Modal, Button } from 'antd';
import React from 'react';

// 登录框
class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true };
        this.handleOk = this.handleOk.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    handleOk(e)  {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel(e) {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Open Modal
                </Button>
                <Modal
                    title="123少儿编程 - 登录"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText='取消'
                    centered={true}
                    closable={true}
                    okText='登录'
                >
                    <Form>
                        <Form.Item validateStatus={'warning'} help={'用户名不能为空'}>
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item>
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default LoginModal;

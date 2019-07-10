import { Form, Icon, Input, Button, Divider } from 'antd';
import React from 'react';
import styles from './share-form.css';
const {TextArea} = Input;

class ShareForm extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
    }

    handleSubmit(e) {
        e.preventDefault();
        let data = this.props.form.getFieldsValue();
        this.props.onSubmit(data);
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Divider style={{fontSize: '12px'}}>更多设置</Divider>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Item label="游戏介绍" >
                        {
                            getFieldDecorator('description', {initialValue: this.props.projDesc})(<TextArea/>)
                        }
                    </Form.Item>
                    <Form.Item className={styles['submit-form-item']}>
                        <Button type="primary" icon='save' htmlType="submit" loading={this.props.loading}>保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedShareForm = Form.create({ name: 'share-form' })(ShareForm);

export default WrappedShareForm;

import { Form, Icon, Input, Button } from 'antd';
import React from 'react';
import styles from './search-bar.css';

class SearchBar extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
    }

    handleSubmit(e) {
        e.preventDefault();
        let data = this.props.form.getFieldsValue();
        this.props.onSearch(data);
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Item >
                        {
                            getFieldDecorator('search_author')(<Input addonBefore={'作者帐号'}/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('search_title')(<Input addonBefore={'作品标题'}/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" icon='search' htmlType="submit">搜索</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedSearchBar = Form.create({ name: 'search-bar' })(SearchBar);

export default WrappedSearchBar;

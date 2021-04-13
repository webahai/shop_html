import React, { Component } from 'react'
import { Form, Input, } from 'antd';
import PropTypes from 'prop-types'

export default class Addform extends Component {
    static propTypes = {
        goodskindname: PropTypes.string
    }

    //类式组件使用from
    formRef = React.createRef();
    //传递form给父组件
    UNSAFE_componentWillMount() {
        this.props.getRef(this.formRef)
    }
    render() {
        const name = this.props.goodskindname
        // console.log(name)
        return (
            <Form
                layout="vertical"
                ref={this.formRef}>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message:'不能为空值'
                        }
                    ]}
                    name={name}
                    initialValue={name}
                    label="分类名字">
                    <Input placeholder='' />
                </Form.Item>
            </Form>
        )
    }
}

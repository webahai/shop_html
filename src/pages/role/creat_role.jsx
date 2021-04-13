import React, { Component } from 'react'
import { Form, Input, } from 'antd';
import PropTypes from 'prop-types'

export default class Creatrole extends Component {
    static propTypes = {
        getrole: PropTypes.func
    }

    // 类式组件使用from
    Ref1 = React.createRef();
    // 传递form给父组件
    UNSAFE_componentWillMount() {
        this.props.getrole(this.Ref1)
    }
    render() {
        return (
            <Form
                layout="vertical"
                ref={this.Ref1}
            >
                <Form.Item name='name' >
                    <Input placeholder='请输入角色名字' />
                </Form.Item>
            </Form>
        )
    }
}


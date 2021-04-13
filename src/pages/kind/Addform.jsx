import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'

const { Option } = Select;

export default class Addform extends Component {
    static propTypes = {
        setFrom: PropTypes.func,
        parentId: PropTypes.string,
        dataSource: PropTypes.array
    }
    //类式组件使用from
    myFrom = React.createRef();

    //传递form给父组件
    UNSAFE_componentWillMount() {
        this.props.setFrom(this.myFrom)
    }

    render() {
        let { parentId, dataSource } = this.props

        return (
            <Form
                layout="vertical"
                ref={this.myFrom}>
                <Form.Item
                    name={parentId}
                    initialValue={parentId}
                    label="所属分类">
                    <Select>
                        <Option value="0">一级列表</Option>
                        {
                            dataSource.map((item) => (<Option value={item._id} key={item._id} >{item.name}</Option>))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message:'不能为空值'
                        }
                    ]}
                    name="name"
                    initialValue=''
                    label="分类名字">
                    <Input />
                </Form.Item>
            </Form >
        )
    }
}


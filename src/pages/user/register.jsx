import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const { Option } = Select;

export default class Register extends Component {
    static propTypes = {
        //父组件传递过来的函数，传递当前表单数据给父组件
        getuserForm: PropTypes.func,
        //接收父组件传递过来的数据
        roles: PropTypes.array.isRequired,
        users: PropTypes.object.isRequired
    }
    formref = React.createRef()

    //初始化一次性数据操作
    inituserform = () => {
        //弹出框表单布局
        this.layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 }
        }
    }

    //根据父组件传递过来的数据生成option选项
    getselect = () => {
        return this.props.roles.map((item) => { return <Option key={item._id} value={item._id}>{item.name}</Option> })
    }

    //周期钩子
    UNSAFE_componentWillMount() {
        this.inituserform()
        this.props.getuserForm(this.formref)
        this.selectnode = this.getselect()
    }

    componentDidUpdate() {
        this.formref.current.resetFields()
    }
    render() {
        let users = this.props.users || {}

        return (
            <Form
                layout='horizontal'
                ref={this.formref}
                {...this.layout}
            >
                <Form.Item
                    name={'username'}
                    label='用户名字'
                    initialValue={users.username}
                    rules={[
                        {
                            required: true,
                            message: '用户名不能为空',
                        },
                        {
                            pattern: /^[0-9A-z_]{4,12}$/,
                            message: '用户名只能由4-12位字母，数字，下划线组成',
                        }
                    ]} >
                    <Input />
                </Form.Item>

                {
                    users._id ? null : (
                        <Form.Item
                            name='password'
                            label='密码'
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空',
                                },
                                {
                                    pattern: /^[\S]{6,12}$/,
                                    message: '密码只能是是6-12位且不能有空格',
                                }
                            ]} >
                            <Input.Password />
                        </Form.Item>
                    )
                }


                <Form.Item
                    name='phone'
                    label='手机号'
                    initialValue={users.phone}
                    rules={[
                        {
                            required: true,
                            message: '手机号码不能为空'
                        },
                        {
                            pattern:/^[\d]+$/,
                            message:'手机号只能是数字哦'
                        }
                    ]} >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='email'
                    label='邮箱'
                    initialValue={users.email}
                    rules={[
                        {
                            required: true,
                            message: '必填'
                        }
                    ]} >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='role_id'
                    label='角色'
                    initialValue={users.role_id}
                    rules={[
                        {
                            required: true,
                            message: '必填'
                        }
                    ]} >
                    <Select >
                        {this.selectnode}
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}

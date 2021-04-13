import React, { Component } from 'react'
import { Card, Modal, Table, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import timer from '../../tool/time'
import { requserList, reqdeleteuser, reqregister, requserupdate } from '../../api'
import LinkButton from '../../tool/button'
import Register from './register'

export default class index extends Component {
    //状态
    state = {
        //用户信息
        users: [],
        isshow: false,
        loading: true
    }
    //初始化表格,标题等一次性数据
    initcolumns = () => {
        this.title = (
            <Button type='primary' onClick={this.createuser} >创建用户</Button>
        )

        //表格头部
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: (abc) => timer(abc, 'YYYY-MM-DD')
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.rolesname[role_id]
            },
            {
                title: '操作',
                render: (data) => (
                    <span>
                        <LinkButton onClick={() => { this.update(data) }}>修改</LinkButton>
                        <LinkButton onClick={() => { this.delete(data) }} >删除</LinkButton>
                    </span>
                )
            },
        ]


    }

    //点击创建用户界面
    createuser = () => {
        this.setState({ isshow: true })
        this.users = null
    }

    //删除用户回调
    delete = (value) => {
        Modal.confirm({
            title: '确认删除么？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                let result = await reqdeleteuser(value._id)
                message.warn(result.message)
                //重新加载组件用户数据
                this.getuser()
            }
        })
    }

    //点击修改用户函数
    update = (value) => {
        this.setState({ isshow: true })
        this.users = value
    }

    //吧id和名字关联成一个对象
    getrolesname = (roles) => {
        this.rolesname = roles.reduce((pre, next) => {
            pre[next._id] = next.name
            return pre
        }, {})
    }

    //组件加载获取用户数据
    getuser = () => {
        let result = requserList()
        result.then((data) => {
            let { roles, users } = data.data
            this.roles = roles
            this.getrolesname(roles)
            this.setState({
                users,
                loading: false
            })
        })
    }

    //取消弹出框回调
    handleCancel = () => {
        this.setState({
            isshow: false
        })
    }

    //创建用户确认回调
    handleOk = async () => {
        let form = await this.userForm.current.validateFields()
        //如果点击的是修改，则发送修改请求
        if (this.users) {
            form._id = this.users._id
            let result = await requserupdate(form)
            if (result.status === 0) {
                this.handleCancel()
                this.getuser()
                return message.success(result.message)
            }
            return message.warn(result.message)
        }
        //否则发送添加用户请求
        let result = await reqregister(form)
        if (result.status === 1) {
            return message.warn(result.message)
        }
        message.success('注册成功')
        this.getuser()
        this.handleCancel()
    }

    //周期钩子
    UNSAFE_componentWillMount() {
        //初始化标题数据
        this.initcolumns()
    }
    //发请求
    componentDidMount() {
        this.getuser()
    }
    render() {
        let { users, isshow, loading } = this.state

        return (
            <Card title={this.title}>
                <Table
                    loading={loading}
                    rowKey='_id'
                    columns={this.columns} dataSource={users} />
                <Modal
                    title={this.users ? '修改用户' : '创建用户'}
                    cancelText='取消'
                    okText='确认'
                    visible={isshow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <Register
                        getuserForm={(formref) => { this.userForm = formref }}
                        roles={this.roles ? this.roles : []}
                        users={this.users ? this.users : {}}
                    />
                </Modal>
            </Card>
        )
    }
}

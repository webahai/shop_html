import React, { Component } from 'react'
import { Card, Table, Button, Modal, message, } from 'antd'

import { reqrole, reqcreaterole, reqroleset } from '../../api'
import Creatrole from './creat_role'
import Roleset from './role_set'
import { memory } from '../../tool/storage'
import timer from '../../tool/time'

export default class Role extends Component {
    state = {
        //表格数据源
        dataSource: [],
        //每行表格数据
        role: {},
        //是否展示弹出框，0：都不展示，1：展示创建角色 2：展示角色授权
        isshow: 0,
        loading: true
    }

    //初始化只渲染一次的数据，表格表头等
    init = () => {
        this.columns = [
            {
                title: '角色名字',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            }, {
                title: '授权时间',
                dataIndex: 'auth_time'
            }, {
                title: '授权人',
                dataIndex: 'auth'
            }]
    }

    //获取用户角色列表
    getrole = async () => {
        let { data } = await reqrole()
        if (!data[0]) {
            return message.warn('没有获取到后端角色数据')
        }
        //吧拿到的数据的时间进行格式化
        data.map((item) => {
            if (item.auth_time) {
                item.auth_time = timer(Number(item.auth_time))
            }
            return item.create_time = timer(Number(item.create_time))
        })
        this.setState({
            dataSource: data,
            loading: false
        })

    }

    //选中角色回调
    check = (id, role) => {
        this.setState({
            role: role[0]
        })
    }

    //点击表格的事件监听
    onRow = (role) => {
        let data = { ...role }
        return {
            onClick: event => {
                //当前行数据的信息，保存到状态管理里
                this.setState({
                    role: { ...data }
                })
            }
        }
    }


    //隐藏弹出框
    handleCancel = () => {
        this.setState({
            isshow: 0
        })
    }

    //点击创建角色
    creatrole = async () => {
        let { name } = await this.roleinfo.current.validateFields()
        //拿到输入框名字，发送请求创建角色
        let result = await reqcreaterole(name)
        if (result.status === 0) {
            message.success(result.message)
        } else {
            message.warn(result.message)
        }
        this.getrole()
        this.handleCancel()
    }

    //用户权限设置回调
    roleset = async () => {
        //拿到当前修改的数据,取出请求接口需要的参数
        let _id = this.state.role._id
        let menus = this.menus
        let auth = memory.user.username
        if (!menus) {
            return message.success('修改前后权限无变化')
        }
        //把状态中的选中的key更换为最新的key
        this.state.role.menus = this.menus
        //发送请求将更改后的权限传到后台数据库
        let result = await reqroleset({ _id, menus, auth })
        if (result.status === 0) {
            message.success(result.message)
            this.handleCancel()
            this.getrole()
            return 
        }
        return message.warn(result.message)
    }

    //组件挂载后
    componentDidMount() {
        this.getrole()
    }
    //组件挂载前
    UNSAFE_componentWillMount() {
        this.init()
    }

    render() {
        //取出state中的状态
        let { dataSource, role, isshow, loading } = this.state
        // console.log(dataSource)


        //每次点击都要改变授权按钮的状态，不能放到只渲染一次的生命周期里面去
        let title = (
            <span >
                <Button type='primary'
                    onClick={() => { this.setState({ isshow: 1 }) }}
                >创建角色</Button>&nbsp;&nbsp;&nbsp;
                <Button
                    disabled={!role._id}
                    onClick={() => { this.setState({ isshow: 2 }) }}
                    type='primary'>角色授权</Button>
            </span>
        )
        return (
            <Card title={title} >
                <Table
                    loading={loading}
                    bordered
                    onRow={this.onRow}
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey='_id'
                    pagination={{ defaultPageSize: 4, showQuickJumper: true }}
                    rowSelection={{
                        type: 'radio',
                        onChange: this.check,
                        selectedRowKeys: [role._id],
                    }}
                />
                <Modal
                    title="创建角色"
                    visible={isshow === 1}
                    onOk={this.creatrole}
                    onCancel={this.handleCancel}>
                    <Creatrole getrole={(role) => { this.roleinfo = role }} />
                </Modal>

                <Modal
                    title="权限设置"
                    visible={isshow === 2}
                    onOk={this.roleset}
                    onCancel={this.handleCancel}>
                    <Roleset getmenus={(menus) => { this.menus = menus }} role={role} />
                </Modal >
            </Card>
        )
    }
}

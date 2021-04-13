//基于前台分页效果
import React, { Component, } from 'react'
import { Card, Table, Modal, message } from 'antd';
import { PlusOutlined, ArrowRightOutlined, } from '@ant-design/icons';

import LinkButton from '../../tool/button'
import Addform from './Addform'
import Update from './update'
//获取，添加，修改商品数据请求
import { reqgoodlist, requpdategoods, reqaddgoods } from '../../api'


export default class Kind extends Component {
    //初始化要显示的数据状态
    state = {
        loading: false,
        dataSource: [],
        childdataSource: [],
        columns: [],
        parentId: '0',
        parentname: '',
        isshow: 0       // 0不显示对话框，2显示添加，1显示更新
    }

    //展示商品分类下属的二级类别
    showchild = (data) => {
        let parentId = data._id
        let parentname = data.name
        //setState可以算的上是个异步过程，要在回调函数中才能拿到最新的状态值
        this.setState({
            parentId,
            parentname
        }, () => {
            this.getdataSource()
        })
    }


    //这里两种情况，如果在子列表里面添加了一级列表，再次回到一级还是需要看到最新数据的
    showgoods = () => {
        this.setState({ parentId: '0' }, () => {
            this.getdataSource()
        })
    }

    //获取商品列表数据展示到页面
    getdataSource = async () => {
        //当数据还没有回来时显示的转动圈
        this.setState({ loading: true })

        let { parentId } = this.state
        let result = await reqgoodlist(parentId)
        if (result.status === 0) {
            if (parentId === '0') {
                this.setState({
                    dataSource: result.data,
                })
            } else {
                // console.log(result.data)
                this.setState({
                    childdataSource: result.data,
                })
            }

        } else {
            console.log('数据没了')
        }
        this.setState({ loading: false })
    }

    //指定分类操作列表的数据
    initcolums = () => {
        let columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                width: '70%'
            },
            {
                title: '操作',
                align: 'center',
                render: (data) => (<span>
                    <LinkButton onClick={() => { this.showupadta(data) }}>修改分类</LinkButton>
                    {this.state.parentId === '0' ? <LinkButton onClick={() => this.showchild(data)} >查看子分类</LinkButton> : ''}
                </span>),
            },

        ]
        this.setState({
            columns
        })
    }

    //展示修改分类对话框,并且吧当前点击的分类id，name，和parentid存起来
    showupadta = (data) => {
        this.setState({ isshow: 1 })
        this.goodskind = data
        // console.log(data)
    }

    //展示添加分类对话框
    showadd = () => {
        this.setState({
            isshow: 2
        })
    }

    //对话框取消按钮回调,清空数据隐藏对话框
    handleCancel = () => {
        //清空添加输入框的数据
        if (this.state.isshow !== 1) {
            this.myFrom.current.resetFields()
        }
        //清空修改输入框的数据
        if (this.state.isshow === 1) {
            this.formRef.current.resetFields()
        }
        this.setState({ isshow: 0 })
    }


    //修改分类确认按钮回调
    upadtekind = async () => {
        //使用指定字段的方式拿到表单数据，name是变动的，所以没法单一拿到某个字段，只能全拿
        let _id = this.goodskind._id
        let key = this.goodskind.name
        let name = this.formRef.current.getFieldsValue()[key]
        //接收修改成功失败结果
        let result = await requpdategoods({ _id, name })
        if (result.status === 1) {
            //提示修改失败
            return message.warn(result.message)
        } else if (this.goodskind.name === name) {
            return message.warn('修改前后值没变化')
        }
        //修改成功隐藏修改框,同时获取当前页面最新数据
        message.success(result.message)
        this.setState({ isshow: 0 })
        this.getdataSource(this.goodskind.parentId)
    }

    //添加对话框确认按钮回调
    addkind = async () => {
        let Id = this.state.parentId
        //使用触发表单验证的方式拿到表单数据
        let data = await this.myFrom.current.validateFields()
        let name = data.name
        let parentId = data[Id]

        // 发送添加商品请求添加商品数据
        let result = await reqaddgoods({ name, parentId })
        if (result.status === 1) {
            return message.warn(result.message)
        }
        else if (result.status === 0) {
            message.success(result.message)
            if (parentId === Id) {
                //重新获取当前最新的数据
                this.getdataSource(parentId)
            }
            //添加完之后隐藏添加框
            this.setState({
                isshow: 0
            })
        }
    }

    //调用动态获取数据的方法(生命周期钩子)
    UNSAFE_componentWillMount() {
        this.getdataSource()
        this.initcolums()
    }


    render() {
        //解构state状态的值
        const {
            parentId,
            dataSource,
            columns,
            loading,
            childdataSource,
            parentname,
            isshow } = this.state
        //拿到定义在this中的商品数据
        let goodskind = this.goodskind || {}
        let title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showgoods}>一级分类列表</LinkButton>
                <ArrowRightOutlined />
                <span>{parentname}</span>
            </span>
        )
        let extra = (
            <LinkButton onClick={this.showadd}><PlusOutlined />添加分类</LinkButton>
        )
        return (
            <div className='kind'>
                <Card title={title} extra={extra}>
                    <Table
                        dataSource={parentId === '0' ? dataSource : childdataSource}
                        rowKey='_id'
                        bordered
                        loading={loading}
                        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                        columns={columns} />;
            </Card>
                <Modal
                    title="修改分类"
                    visible={isshow === 1}
                    onOk={this.upadtekind}
                    onCancel={this.handleCancel}>
                    <Update getRef={(forRef) => { this.formRef = forRef }} goodskindname={goodskind.name} />
                </Modal>

                <Modal
                    title="添加分类"
                    visible={isshow === 2}
                    onOk={this.addkind}
                    onCancel={this.handleCancel}>
                    <Addform
                        setFrom={(myFrom) => { this.myFrom = myFrom }}
                        parentId={parentId}
                        dataSource={dataSource} />
                </Modal>
            </div>
        )
    }
}

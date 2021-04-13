//基于后台分页
import React, { Component } from 'react'
import { Card, Select, Button, Input, Table, message } from 'antd'
import { reqshop, reqsearchshop, reqstatus } from '../../api'

import LinkButton from '../../tool/button'

const { Option } = Select
//定义每页显示多少条数据
const pageSize = 3;

export default class Home extends Component {
    state = {
        dataSource: [],
        //数据的总数量
        datalength: '',
        //表格头部的固定静态部分
        columns: [],
        title: '',
        extra: '',
        //是否显示加载中
        loading: false,
        //搜索的类型和关键字
        searchtype: 'searchName',
        key: '',
    }

    inputref = React.createRef()
    //获取商品数据
    getdataSource = async (pageNum = 1) => {
        //保存当前页数
        this.pageNum = pageNum
        this.setState({ loading: true })
        let { key, searchtype } = this.state
        if (key) {
            let result = await reqsearchshop({ pageNum, pageSize, key, searchtype })
            this.setState({
                dataSource: result.data,
                datalength: result.length,
                loading: false
            })
        } else {
            let result = await reqshop({ pageNum, pageSize })
            this.setState({
                dataSource: result.data,
                datalength: result.length,
                loading: false,
            })
        }
    }

    //改变上架下架状态
    changestatus = (statu) => {
        let { _id, status } = statu
        if (status === '1') {
            reqstatus({ _id, status: '0' })
            this.getdataSource(this.pageNum)
        } else {
            reqstatus({ _id, status: '1' })
            this.getdataSource(this.pageNum)
        }
    }
    //初始化表格数据操作
    initcolumns = () => {
        let columns = [{
            title: '商品名称',
            dataIndex: 'name',
        },
        {
            align: 'center',
            title: '商品描述',
            dataIndex: 'desc',
        },
        {
            title: '价格',
            dataIndex: 'price',
            render: (price) => (
                '￥' + price
            )
        },
        {
            width: 80,
            title: '状态',
            render: (statu) => (
                <span>
                    <LinkButton
                        onClick={() => { this.changestatus(statu) }} >
                        {statu.status === '0' ? '下架' : '上架'}
                    </LinkButton>
                    {statu.status === '0' ? '在售' : '已下架'}
                </span>
            )
        },
        {
            width: '75px',
            title: '操作',
            render: (dataSource) => (
                <span>
                    <LinkButton onClick={() => this.props.history.push('shop/detail', dataSource)} >详情</LinkButton>
                    <LinkButton onClick={() => this.props.history.push('shop/addupdate', dataSource)} >修改</LinkButton>
                </span>
            )
        }]
        let title = (
            <div style={{ width: '20%' }}>
                <Select defaultValue='searchName'
                    onSelect={(node) => { this.ok(node) }}
                    style={{ width: 120 }} >
                    <Option value='searchName' >按名称搜索</Option>
                    <Option value='searchDesc' >按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    maxLength='10'
                    ref={this.inputref}
                    onChange={(node) => { this.ok(node) }}
                    style={{ margin: '0 10px 0 10px' }} />
                <Button type='primary' onClick={this.ok}>搜索</Button>
            </div>
        )
        let extra = (
            <Button type='primary' onClick={() => { this.props.history.push('shop/addupdate') }} >添加商品</Button>
        )
        //初始化好的操作列表渲染到状态里
        this.setState({
            columns,
            title,
            extra,
        })
    }


    //收集搜索框，下拉框数据并且点击的时候发送请求
    ok = async (node) => {
        // 判断当前是不是下拉框
        if (typeof (node) !== 'string') {
            //判断是不是搜索框
            if (node.type === 'change') {
                if (node.target.value.trim()) {
                    let key = node.target.value
                    this.setState({
                        key
                    })
                }
                //判断是不是搜索按钮
            } else if (node.type === 'click') {
                if (this.state.key) {
                    this.setState({
                        key: ''
                    })
                    this.getdataSource()
                    //有bug  再次点击内容还在
                    return this.inputref.current.input.value = ''
                }
                else {
                    message.success('请重新输入关键字')
                    this.getdataSource()
                }
            }
        } else {
            this.setState({
                searchtype: node
            })
        }
    }

    //挂载组件之前调用初始化的一些数据方法
    UNSAFE_componentWillMount() {
        this.initcolumns()
        //获取商品数据的时候指定跳过多少页和当前页显示多少数据
        this.getdataSource()
    }

    render() {
        let { extra, title, columns, loading, dataSource, datalength } = this.state
        
        return (
            <Card title={title}
                extra={extra}>
                <Table
                    loading={loading}
                    rowKey='_id'
                    bordered
                    dataSource={dataSource}
                    pagination={{
                        current: this.pageNum,
                        total: datalength,
                        defaultPageSize: pageSize,
                        showQuickJumper: true,
                        onChange: this.getdataSource
                    }}
                    columns={columns} />
            </Card>
        )
    }
}

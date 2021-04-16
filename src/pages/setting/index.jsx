import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Card, Button, message } from 'antd'

import {reqshop} from '../../api'

export default class Setting extends Component {
    state = {
        data: []
    }
    //初始化视图数据
    inittitle = (data) => {
        //数据源
        return {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '饼状图',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '25',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: data
                }
            ]
        }
    }

    //获取商品名字
    getshopname = (data) => {
        //顶部标题
        this.title = (
            <Button type='primary' onClick={() => { message.success('暂无数据更新') }}>更新商品</Button>
        )
        let shop = []
        data.map(item => {
            return shop.push({
                name:item.name,
                value:item.price
            })
        })
        return shop
    }

    //生命周期
    async UNSAFE_componentWillMount() {
        //获取card标题
        this.title = (
            <Button type='primary' onClick={() => { message.success('暂无数据更新') }}>更新商品</Button>
        )
        let pageNum = 1, pageSize = 10
        let { data } = await reqshop(pageNum, pageSize)
        let result = this.getshopname(data)
        this.setState({
            data:result
        })
    }
    render() {
        let { data } = this.state
        return (
            <Card title={this.title}>
                <ReactEcharts option={this.inittitle(data)} />
            </Card>
        )
    }
}

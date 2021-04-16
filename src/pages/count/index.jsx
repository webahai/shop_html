import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Card, Button, message } from 'antd'

import { reqshop } from '../../api'

export default class Count extends Component {
    state = {
        //实际从后台获取数据。这里写死了
        shop: [],
        category: []
    }
    //初始化图表数据
    inittitle = (shop, category) => {
        return {
            title: {
                text: '价格柱状图'
            },
            tooltip: {},
            legend: {
                data: ['价格']
            },
            xAxis: {
                data: category,
                offset: 15,
                axisLabel: {
                    align: 'center',
                    interval: 0,
                    rotate: -20
                }
            },
            yAxis: {},
            series: [{
                name: '价格',
                data: shop,
                type: 'bar'
            }]
        }
    }

    //获取商品信息
    getshopname = (data) => {
        //顶部标题
        this.title = (
            <Button type='primary' onClick={() => { message.success('暂无数据更新') }}>更新商品</Button>
        )
        let shop = []
        let category = []
        data.map(item => {
            category.push(item.name)
            shop.push(item.price) 
        })
        return {shop,category}
    }

    //生命周期
    async UNSAFE_componentWillMount() {
        let pageNum = 1, pageSize = 10
        let { data } = await reqshop(pageNum, pageSize)
        let result = this.getshopname(data)
        this.setState({
            shop:result.shop,
            category:result.category
        })
    }
    render() {
        let { shop, category } = this.state
        return (
            <Card title={this.title}>
                <ReactEcharts option={this.inittitle(shop, category)} />
            </Card>
        )
    }
}

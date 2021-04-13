import React, { Component } from 'react'
import { Card, } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

import './detail.less'
import LinkButton from '../../tool/button'
import { reqgoodlist } from '../../api'

export default class Detail extends Component {
    state = {
        name1: '',
        name2: ''
    }

    //判断分类层级
    getname = async (findparent) => {
        let { parentId, name } = this.props.location.state
        if (parentId === '0') {
            return this.setState({ name1: name, name2: null })
        } else {
            let { data } = await reqgoodlist(parentId, findparent = '1')
            if (data[0].parentId === '0') {
                return this.setState({ name1: data[0].name, name2: null })
            }
            let name2 = data[0].name
            // console.log(name2)
            let result = await reqgoodlist(data[0].parentId, findparent = '1')
            let name1 = result.data[0].name
            // console.log(name1)
            this.setState({ name1, name2 })
        }
    }

    //获取图片显示
    getpicture = () => {
        let data = this.props.location.state.imgUrl
        return data.map((item) => {
            if (!item.url) {
                return ''
            }
            return (
                <img src={item.url} alt={item.name} key={item.name} />
            )
        })
    }


    UNSAFE_componentWillMount() {
        this.getname()
    }
    //点击回到上层页面
    backhome = () => {
        this.props.history.push('/shop')
    }
    render() {
        const title = (
            <span>
                <LinkButton
                    onClick={this.backhome}
                    style={{ marginRight: '5px' }}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        let data = this.props.location.state
        let name = this.state
        return (
            <Card title={title} className='detail'>
                <div className='title'>
                    <span >商品名称:</span>
                    <span>{data.name}</span>
                </div>
                <div className='title'>
                    <span>商品描述:</span>
                    <span>{data.desc}</span>
                </div>
                <div className='title'>
                    <span>商品价格:</span>
                    <span>{data.price}</span>
                </div>
                <div className='title'>
                    <span>所属分类:</span>
                    <span>{name.name1}</span>
                    {name.name2 === null ? '' : <span>  <ArrowRightOutlined style={{ margin: '0 5px' }} />{name.name2}</span>}
                </div>
                <div className='title'>
                    <span>商品图片:</span>
                    {this.getpicture()}
                </div>
                <div className='title'>
                    <span className='title'>商品详情:</span>
                    <span>{data.info}</span>
                </div>
            </Card>
        )
    }
}

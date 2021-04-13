import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Layout, } from 'antd';


import './admin.less'
import { memory } from '../../tool/storage'

import LeftNave from '../../components/left-nav'
import Context from '../../components/context'
import Header from '../../components/header';

const { Content, Footer, Sider } = Layout;

export default class Admin extends Component {
    render() {
        const user = memory.user
        //判断是否登录，否则跳转回到登录页面
        if (!user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout>
                <Sider style={{ backgroundColor: 'white' }}>
                    <LeftNave />
                </Sider>
                <Layout className="site-layout">
                    <Header />
                    <Content className='content'>
                        <Context />
                    </Content>
                    <Footer className='foot' >
                        <span>本页面建议使用chrome浏览器获取良好体验</span>
                        <div>@版权所有:理工学院and熊某人</div></Footer>
                </Layout>
            </Layout>
        )
    }
}

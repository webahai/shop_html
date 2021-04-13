import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

//路由器，负责展示导航栏对应的页面组件
import './content.less'
import Home from '../../pages/home'
import Kind from '../../pages/kind'
import Shop from '../../pages/shop'
import Role from '../../pages/role'
import Count from '../../pages/count'
import Setting from '../../pages/setting'
import User from '../../pages/user'

export default class Content extends Component {
    render() {
        return (
            <div className="context" >
                <Switch>
                    <Route path='/home' component={Home} />
                    <Route path='/kind' component={Kind} />
                    <Route path='/shop' component={Shop} />
                    <Route path='/user' component={User} />
                    <Route path='/role' component={Role} />
                    <Route path='/count' component={Count} />
                    <Route path='/setting' component={Setting} />
                    <Redirect to='/home' />
                </Switch>
            </div>
        )
    }
}

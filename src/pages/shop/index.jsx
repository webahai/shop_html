//商品列表路由器--展示对应的路由界面
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './home'
import Detail from './detail'
import Addupdate from './addupdate'
export default class Shop extends Component {
    render() {
        return (
            <Switch>
                <Route path='/shop/detail' component={Detail} />
                <Route path='/shop/addupdate' component={Addupdate} />
                <Route path='/shop' component={Home} />
            </Switch>
        )
    }
}

import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons'


import './leftNave.less'
import logo from '../../images/logo.png'
import menuconfig from '../../config/menuconfig'
import { storage } from '../../tool/storage'

const { SubMenu } = Menu;
class LeftNave extends Component {
    //当前是否授权
    isauth = (item) => {
        let key = item.key
        let user = storage.readUser('user_key')
        let role = storage.readUser('role_key')
        //如果当前用户是admin、当前目录是否公开、或者菜单允许访问
        if (user.username === 'admin' || item.ispublic === 'true' || role.menus.indexOf(key) !== -1) {
            return true
            //如果当前用户有此item下的子item权限
        } else if (item.children) {
            return !!item.children.find(child => role.menus.indexOf(child.key) !== -1)
        }
        return false
    }

    getmenu = (menuconfig) => {
        return menuconfig.map(item => {
            if (this.isauth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key} icon={React.createElement(Icon[item.icon],)}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    )
                } else {
                    const citem = item.children.find(citem => { return this.props.location.pathname.indexOf(citem.key) === 0 })
                    if (citem) {
                        this.open = item.key
                    }
                    return (
                        <SubMenu key={item.key} icon={React.createElement(Icon[item.icon], {})} title={item.title}>
                            {
                                this.getmenu(item.children)
                            }
                        </SubMenu>
                    )
                }
            }
        }
        )
    }

    UNSAFE_componentWillMount() {
        this.menunodes = this.getmenu(menuconfig)
    }
    render() {
        let path;
        if (this.props.location.pathname.indexOf('/', 1) < 0) {
            path = this.props.location.pathname
        } else {
            path = this.props.location.pathname.substr(0, this.props.location.pathname.indexOf('/', 1))
        }
        return (
            <div className='leftNav'>
                <div className="logo" >
                    <img src={logo} alt="logo图片" />
                    <h3>理工后台</h3>
                </div>
                <Menu theme="light"
                    defaultOpenKeys={[this.open]}
                    defaultSelectedKeys={[path]}
                    mode="inline">
                    {
                        this.menunodes
                    }
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNave)
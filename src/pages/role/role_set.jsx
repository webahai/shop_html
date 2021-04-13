import React, { Component } from 'react'
import { Form, Tree, Input, } from 'antd';
import PropTypes from 'prop-types'

import menuList from '../../config/menuconfig'

export default class Roleset extends Component {
    constructor(props) {
        super(props)
        let { menus } = this.props.role
        this.state = {
            treeData: [],
            checkedKeys: menus
        }
    }

    //声明接收父组件传递的数据
    static propTypes = {
        role: PropTypes.object,
        getmenus: PropTypes.func
    }

    //所有选中的复选框
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys })
        //将勾选的所有选项传给父组件
        this.props.getmenus(checkedKeys)
    }

    //生成相应的树形权限框
    getmenusnodde = (menuList) => {
        let fun1 = (menuList) => {
            return menuList.reduce((pre, item) => {
                if (!item.children) {
                    pre.push(
                        {
                            title: item.title,
                            key: item.key,
                        }
                    )
                } else {
                    pre.push(
                        {
                            title: item.title,
                            key: item.key,
                            children: fun1(item.children)
                        }
                    )
                }
                return pre
            }, [])
        }
        let result = fun1(menuList)
        // console.log(result)
        let treeData = [{
            title: '用户权限',
            key: '0',
            children: []
        }]
        treeData[0].children = result
        this.setState({
            treeData
        })
    }

    // 生命周期钩子
    UNSAFE_componentWillMount() {
        this.getmenusnodde(menuList)
    }

    //props改变，对props进行重置。
    UNSAFE_componentWillReceiveProps(nextProps) {
        let checkedKeys = nextProps.role.menus
        this.setState({
            checkedKeys
        })
    }

    render() {
        //获取父组件传递过来的数据
        let { role } = this.props
        // 获取state中保存的数据
        let { treeData, checkedKeys } = this.state
        //输入框布局
        let Layout = {
            labelCol: { span: 4 },  //左侧宽度
            wrapperCol: { span: 15 }    //右侧宽度
        }
        return (
            <Form>
                <Form.Item label="当前角色"
                    {...Layout}>
                    <Input
                        disabled={true}
                        value={role.name} />
                </Form.Item>
                <Form.Item>
                    <Tree
                        checkable
                        defaultExpandAll='true'
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                        treeData={treeData}
                    />
                </Form.Item>
            </Form>
        )
    }
}


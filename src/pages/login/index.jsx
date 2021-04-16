//引入第三方包
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, Checkbox, message, } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

//引入本地文件
import './login.less'
import logo from '../../images/logo.png'
import { reqlogon ,reqrole} from '../../api'
import { memory, storage } from '../../tool/storage'


export default class Login extends Component {
    //用户登录
   onFinish = async (values) => {
        if (!values) {
            message.error('没有填写账号密码')
        }
        // console.log('收到数据，开始发生axios请求')
        let response = await reqlogon(values)

        if (response.status === 0) {
            //登录成功，跳转admin页面
            message.success('登录成功')
            //缓存登录状态
            storage.saveUser(response.data)

            //发送请求，缓存当前账户权限
            let _id=response.data.role_id
            let {data}=await reqrole(_id)
            storage.saveUser(data,'role_key')
            
            // 跳转admin页面
            this.props.history.go('/home')

        } else if (response.status === 1) {
            //登录失败，提示用户登录错误
            message.error('登录失败,请检查当前账户密码是否正确')
        }
    }
    render() {
        // 判断用户是否登录
        let user = memory.user
        if (user._id) {
            return <Redirect to='/home' />
        }
        
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo图片" />
                    <h1>欢迎来到理工后台页面</h1>
                </header>
                <section className='login-section'>
                    <h2>用户登录</h2>
                    <Form className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '用户名不能为空',
                                },
                                {
                                    pattern: /^[0-9A-z_]{4,12}$/,
                                    message: '用户名只能由4-12位字母，数字，下划线组成',
                                }
                            ]}>
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空',
                                },
                                {
                                    pattern: /^[\S]{6,12}$/,
                                    message: '密码只能是是6-12位且不能有空格',
                                }
                            ]}>
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码" />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                            <a href='#' className='login-form-forgot' onClick={() => { message.success('请联系管理员或者熊某人') }} >忘记密码？</a>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}


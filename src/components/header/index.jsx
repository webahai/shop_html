import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

//样式文件
import './header.less'
//代替a标签
import LinkButton from '../../tool/button'
//读取用户登录信息
import { storage, } from '../../tool/storage'
//格式化时间
import formateDate from '../../tool/time'
//请求天气数据
import { reqweath } from '../../api'
//获取顶部标题
import menuconfig from '../../config/menuconfig'

const { confirm } = Modal;
class Header extends Component {
    //初始化状态
    state = {
        nowTime: formateDate(Date.now()),
        daypicture: '',
        weather: '',
    }
    //退出登录跳转登录页面
    cancelLongin = () => {
        confirm({
            title: '确定不再留一下?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                message.warning('客官慢走啊，下次再来')
                storage.removeUser()
                this.props.history.go('/login')
            },
            onCancel: () => {
                message.success('明智的选择')
            },
        });
    }
    //动态显示当前时间
    getTime = () => {
        this.timerID = setInterval(() => {
            const nowTime = formateDate(Date.now())
            this.setState({ nowTime })
            // console.log(nowTime)
        }, 1000)
    }
    //动态获取天气数据(地点写死了，后期从用户登录信息动态获取当前地点)
    getWeath = () => {
        reqweath('贵州')
            .then((data) => {
                const { weather, temperature } = data
                this.setState({ weather, temperature })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    //获取标题名字
    geTtitle = (menuconfig) => {
        menuconfig.map(item => {
            if (!item.children) {
                if (item.key.indexOf(this.props.location.pathname) > -1) {
                    return this.title = item.title
                }
                return ''
            } else {
                return this.geTtitle(item.children)
            }
        })
    }

    //生命周期函数
    //组件挂载之后动态调用方法
    componentDidMount() {
        this.getTime()
        this.getWeath()
        this.geTtitle(menuconfig)
    }

    //组件卸载前清楚定时器等操作
    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    render() {
        const { nowTime, temperature, weather } = this.state
        let user = storage.readUser()
        this.geTtitle(menuconfig)
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>
                        欢迎，{user.username}
                    </span>
                    <LinkButton onClick={this.cancelLongin}>退出登录</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {this.title}
                        <div className='arrow'></div>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{nowTime}</span>
                        <img src="https://tq-s.malmam.com/images/icon/256/01.png" alt="天气" />
                        <span>{weather}</span>
                        &nbsp;&nbsp;
                        <span>{temperature}</span>&nbsp;
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
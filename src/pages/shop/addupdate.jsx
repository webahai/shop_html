import React, { Component } from 'react'
import { Card, Form, Button, Input, Cascader, Upload, Modal, message } from 'antd'
import { ArrowLeftOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import { reqgoodlist, reqaddshop, reqdelateshop, reqshopupdata } from '../../api'
import LinkButton from '../../tool/button'
import './addupdate.less'

const { TextArea } = Input;


export default class Addupdate extends Component {
    //初始化状态state
    state = {
        //图片列表数组
        fileList: [],
        //预览大图的url
        previewImage: '',
        //初始隐藏modal
        previewVisible: false,
        loading: false,
        //联级数据
        options: [],
        childoptions: []
    }

    //点击箭头回退home页面
    backhome = () => {
        this.props.history.push('/shop')
    }

    //初始化分类联级选择,布局信息,标题信息等
    initkind = () => {
        //表单输入框布局
        this.layout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 15 },
        }
        //表单标题
        this.title = (
            <span>
                <LinkButton
                    onClick={this.backhome}
                    style={{ marginRight: '5px' }}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{this.isupdata === true ? '修改商品' : '添加商品'}</span>
            </span>
        )
        //初始图片信息
        if (this.isupdata) {
            let fileList = []
            let imgUrl = this.props.location.state.imgUrl
            if (this.props.location.state.imgUrl.length > 0) {
                imgUrl.map(item => {
                    return fileList.push(item)
                })
                this.setState({
                    fileList
                })
            }
        }
    }

    //获取联级框数据
    getkind = async (parentId = 0) => {
        var options = []
        if (parentId === 0) {
            let { data } = await reqgoodlist(parentId)
            data.map(item => {
                let citem = {
                    label: item.name,
                    value: item._id,
                    isLeaf: false
                }
                options.push(citem)
                return options
            })
            if (this.isupdata) {
                let kind = this.props.location.state.kind
                if (kind[1]) {
                    let childoptions = []
                    let parentId = kind[0]
                    let { data } = await reqgoodlist(parentId)
                    data.map(item => {
                        let citem = {
                            label: item.name,
                            value: item._id,
                            isLeaf: true
                        }
                        return childoptions.push(citem)
                    })
                    let index
                    for (let i in options) {
                        if (data[0].parentId === options[i].value) {
                            index = i
                        }
                    }
                    options[index].children = childoptions
                    return this.setState({
                        options
                    })
                }
            }
            this.setState({ options })
        } else {
            let { data } = await reqgoodlist(parentId)
            let childoptions = []
            data.map(item => {
                let citem = {
                    label: item.name,
                    value: item._id,
                    isLeaf: true
                }
                return childoptions.push(citem)
            })
            return childoptions
        }
    }

    //重新隐藏照片预览框
    handleCancel = () => {
        this.setState({ previewVisible: false })
    }

    //将图片转成base64预览
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

    //预览照片信息
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            //没图片默认显示一些东西
            file.preview = await this.getBase64(file.originFileObj);
        }
        //显示预览图片
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        })
    }

    //文件状态改变回调
    //file:操作的文件  
    //fileList：已上传的文件   
    //event上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持。
    handleChange = ({ fileList, file, event }) => {
        if (file.status === 'done') {
            message.success('图片上传成功')
            let result = file.response
            let { name, url } = result
            file.name = name
            file.url = url
            //删除图片
        } else if (file.status === "removed") {
            let name = file.name
            reqdelateshop(name)
                .then((result) => {
                    message.success(result.message)
                }).catch((err) => {
                    console.log(err)
                })
        }
        else if (file.status === 'error') {
            message.warn('文件上传失败')
        }
        this.setState({
            fileList
        })
    }

    //提交表单信息收集数据
    onFinish = async (value) => {
        //添加商品
        if (!this.isupdata) {
            if (value.imgUrl.fileList) {
                //取出imgulr里面的fileList
                let { fileList } = value.imgUrl
                let imgurl = []
                fileList.map((item) => {
                    return imgurl.push({
                        name: item.response.name,
                        url: item.response.url
                    })
                })
                value.imgUrl = imgurl
                let result = await reqaddshop(value)
                message.success(result.message)
                this.backhome()
            } else {
                //先把imgurl赋值为空数组，再发请求
                value.imgUrl = []
                let result = await reqaddshop(value)
                message.success(result.message)
                this.backhome()
            }
        } else {
            if (value.imgUrl.fileList) {
                let { fileList } = value.imgUrl
                let imgUrl = []
                fileList.map((item) => {
                    return imgUrl.push(item.response)
                })
                value.imgUrl = imgUrl
            }
            let { _id } = this.props.location.state
            value._id = _id
            // console.log(value)
            let result = await reqshopupdata(value)
            console.log(result)
        }
    }


    //组件挂载钩子,初始化不需要多次调用的数据
    UNSAFE_componentWillMount() {
        //判断当前进入的是否是修改页面，
        this.isupdata = !!this.props.location.state
        this.initkind()
    }

    componentDidMount() {
        //页面加载完毕之后获取一级分类列表
        this.getkind()
    }

    //改变联级框时数据录入
    loadData = async (data) => {
        data[0].loading = true
        let childoptions = await this.getkind(data[0].value)
        data[0].loading = false
        if (childoptions.length !== 0) {
            data[0].children = childoptions
            this.setState({
                options: [...this.state.options]
            })
        } else {
            data[0].isLeaf = true
        }
    }

    render() {
        //取出状态管理中的属性
        let { options, fileList, loading, previewVisible, previewImage } = this.state
        if (this.isupdata) {
            var { name, desc, price, info, kind } = this.props.location.state
        }
        let uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        )
        return (
            <Card
                title={this.title} className='addupdate' >
                <Form
                    labelAlign='left'
                    {...this.layout}
                    layout='horizontal'
                    onFinish={this.onFinish} >
                    <Form.Item
                        name='name'
                        initialValue={this.isupdata ? name : ''}
                        rules={[{
                            required: true,
                            message: '必填项'
                        }]}
                        label='商品名称 ' >

                        <Input
                            placeholder='商品名字' ></Input>
                    </Form.Item>

                    <Form.Item
                        rules={[{
                            required: true,
                            message: '必填项'
                        }]}
                        name='desc'
                        initialValue={this.isupdata ? desc : ''}
                        label='商品描述'>
                        <TextArea
                            placeholder="商品描述"
                            autoSize={{ minRows: 2, maxRows: 5 }} />
                    </Form.Item>

                    <Form.Item
                        name='price'
                        initialValue={this.isupdata ? price : ''}
                        label='商品价格:'
                        rules={[{
                            required: true,
                            message: '必填项'
                        }, {
                            pattern: /^[\d]+$/,
                            message: '只能是数字'
                        }]}>
                        <Input suffix="RMB"></Input>
                    </Form.Item>

                    <Form.Item
                        name='kind'
                        rules={[{
                            required: true,
                            message: '必填项'
                        }]}
                        initialValue={this.isupdata ? kind : ''}
                        label='商品分类' >
                        <Cascader
                            loadData={this.loadData}
                            options={options} />
                    </Form.Item>

                    <Form.Item
                        name='imgUrl'
                        label='商品图片' >
                        <Upload
                            accept='image/*'
                            listType="picture-card"
                            action='http://localhost:5000/upload/image'
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}>
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name='info'
                        initialValue={this.isupdata ? info : ''}
                        rules={[{
                            required: true,
                            message: '必填项'
                        }]}
                        label='商品描述'>
                        <TextArea
                            placeholder="商品详情信息"
                            autoSize={{ minRows: 2, maxRows: 5 }} />
                    </Form.Item>

                    <Form.Item  >
                        <Button
                            type='primary'
                            htmlType='submit' >提交修改</Button>
                    </Form.Item>
                </Form>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}>
                    <img alt="picter" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Card>
        )
    }
}

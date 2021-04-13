import ajax from './ajax'
import jsonp from 'jsonp'
import {
    message
} from 'antd'

//跨域代理api
const base = '/api';

//登录请求函数
export const reqlogon = ({
    username,
    password
}) => ajax(base + '/login', {
    username,
    password
})

//获取天气请求
export const reqweath = (city) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=5d2d3e6c0d5188bec134fc4fc1b139e0&city=${city}&extensions=base`
    return new Promise((resolove, reject) => {
        jsonp(url, (err, data) => {
            if (!err) {
                resolove(data.lives[0])
            } else {
                message.error(err)
            }
        })
    })
}

//获取商品列表请求，前台分页 findparent为1则根据_id查询数据
export const reqgoodlist = (parentId,findparent='') => ajax(base + '/goods', {
    parentId,
    findparent
})

//添加商品分类请求
export const reqaddgoods = ({
    name,
    parentId
}) => ajax(base + '/addgoods', {
    name,
    parentId
})

//修改商品分类请求
export const requpdategoods = ({
    _id,
    name
}) => ajax(base + '/updategoods', {
    _id,
    name
})

//获取商品数据请求，基于后台分页
export const reqshop = (({
    pageNum,
    pageSize
}) => ajax(base + '/shop', {
    pageNum,
    pageSize
}))

//搜索商品列表，基于后台分页
export const reqsearchshop = ({
    pageNum,
    pageSize,
    key,
    searchtype,
}) => ajax(base + '/shop/search', {
    pageNum,
    pageSize,
    key,
    searchtype
})

//商品上架下架状态接口
export const reqstatus=({_id,status})=>ajax(base+'/shop/stateupd',{_id,status})

//添加商品请求接口
export const reqaddshop=(info)=>ajax(base+'/addshop',{...info},'POST')

//删除商品图片接口
export const reqdelateshop=(name)=>ajax(base+'/delate/image',{name},'POST')

//更新商品数据接口 _id
export const reqshopupdata=(info)=>ajax(base+'/shopupdata',{...info},'POST')

//获取用户权限角色接口
export const reqrole=(_id)=>ajax(base+'/role',{_id})

//创建角色接口
export const reqcreaterole=(name)=>ajax(base+'/createrole',{name})

//角色权限更改接口
export const reqroleset=(info)=>ajax(base+'/roleset',{...info})

//获取用户信息列表
export const requserList=()=>ajax(base+'/usersList')

//删除用户接口
export const reqdeleteuser=(_id)=>ajax(base+'/userdeleter',{_id},'POST')

//用户注册接口
export const reqregister=(info)=>ajax(base+'/register',{...info},'POST')

//用户修改信息接口
export const requserupdate=(info)=>ajax(base+'/userupdate',{...info},'POST')
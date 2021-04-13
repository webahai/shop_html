import axios from 'axios'
import {message} from 'antd'
//封装ajax请求工具模块
export default function ajax(url, data = {}, type = "GET") {
    return new Promise((resolve,)=>{
        let p;
        if (type === "GET") {
            p=axios.get(url, {
                params: data
            })
        } else {
            p=axios.post(url, data)
        }
        p.then((respone)=>{
            resolve(respone.data)
        })
        .catch((error)=>{
            message.error('请求出错'+error)    
        })
    })
}
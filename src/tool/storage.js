//存储用户信息，维持登录状态,原生写法
// export default{
//     saveUser(user){
//         localStorage.setItem('user_key', JSON.stringify(user))
//     },
//     readUser(){
//         return JSON.parse(localStorage.getItem("user_key")||'{}')
//     },
//     removeUser(value){
//         localStorage.removeItem('user_key')
//     }
// }'user_key'

//借助store库
import store from 'store'
export const storage={
    saveUser(user,key='user_key') {
        store.set(key, user)
    },
    readUser(key='user_key') {
        return store.get(key)|| {}
    },
    removeUser(key='user_key') {
        store.remove(key)
    }
}
//stroe.clearAll()清除所有缓存
//store.each((value,key)=>{})    遍历所有缓存
export const memory={
    user:{}
}
const proxy = require('http-proxy-middleware')
module.exports = function (app) {
    app.use(
        proxy('/api', {
            //当请求地址中有/api时启动代理帮我们请求5000这个地址
            target: "http://localhost:5000",
            //告诉服务器请求是从哪里发出去的。
            changeOrigin: true,
            //将我们地址中多加入的/api1换成空串变成正常地址
            pathRewrite: { "^/api": "" }
        })
    )
}

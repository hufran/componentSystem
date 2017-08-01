/**
 * Created by Administrator on 2017/7/19.
 * 配置转义器
 */
var webpack=require("webpack");
var path = require('path');
var fs=require("fs");
function entryOpera(){
    //文件入口
    var filePath=path.resolve(__dirname,"public/src/");
    var fileList=fs.readdirSync(filePath);
    var length=fileList.length;
    var entryList={};
    if(length>0){
        for(var i=0;i<length;i++){
            var currentPath=path.resolve(filePath,fileList[i]);
            if(fileList[i]=="common"){
                //common公用组件方法，需要单独处理
                currentPath=path.resolve(currentPath,"js");
                var commonFileList=fs.readdirSync(currentPath);
                for(let i=0,len=commonFileList.length;i<len;i++){
                    entryList[commonFileList[i]]="./public/src/common/js/"+commonFileList[i];
                }
            }else{
                //其他部分，编译main.js文件即可
                entryList[fileList[i]]="./public/src/"+fileList[i]+"/js/main.js";
            }
        }
    }
    return entryList;
}

module.exports={
    //插件项
    plugins:[
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common'),
        new webpack.HotModuleReplacementPlugin()
    ],
    //页面入口文件配置
    entry:entryOpera(),
    //入口文件输出配置
    output:{
        path:path.resolve(__dirname, 'public/dist/'),
        filename:"[name].min.js",
        chunkFilename: '[id].[chunkhash].js'
    },
    module:{
        //加载器配置
        rules:[
            {test:/\.css$/,loader:"style-loader!css-loader!stylus-loader"},
            {test:/\.js$/,exclude: /node_modules/,loader: ['babel-loader?{"presets":["es2015"],"plugins":["transform-decorators-legacy"],cacheDirectory:true}']},//$ npm install babel-loader
            {
                test:/\.(png|jpe?g|gif|svg)$/,
                loader:"url-loader?limit=10000",
                options: {
                    limit: 10000
                }
            }
        ]
    },
    resolve:{
        //其它解决方案配置,最后是 resolve 配置，配置查找模块的路径和扩展名和别名（方便书写）
        extensions:[ '.js', '.json', '.scss','.css'],
        alias: {
            'src': path.resolve(__dirname, './public/js'),
            'assets': path.resolve(__dirname, './public/images'),
            'components': path.resolve(__dirname, './public/js/')
        }
    }
};


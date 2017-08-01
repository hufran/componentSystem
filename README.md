一、项目安装
    在需要下载的目录下执行git clone git@10.4.33.236:hufuchen/componentSystem.git命令，并在clone命令执行完成后，
    调用npm install 命令安装，安装后进行项目编译
二、项目编译
    项目开发时，需要启动编译命令后（webpack --watch 命令），即可按照文件访问方式访问文件，
    例如访问组件示例需要文件编译完成后，进入public/src/carousel目录下，打开index.html文件即可。
    后期组件系统完成后，可以开启node服务，index.html中的js文件目录修改为public下的文件即可
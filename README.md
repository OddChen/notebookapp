# React+Ant 简易笔记本
### 启动
<b>npm install 在每个文件夹下分别安装依赖</b>  
<b>在notebookapp 目录下，终端运行 npm start 直接启动</b>

client 为前台页面  
主要包含笔记显示、新增、删除、更新这四个部分  
页面数据获取频率可在componentDidMount()下修改  
package.json中添加了一个代理，指向后台程序运行端口

backend 为服务端  
负责提供接口连接MongoDB  
自行修改dbRoute成自己的数据库地址
终端运行node server.js即可单独启动

### 小结
只完成了一个简单的笔记本功能，实现了增、删、改、查，后续还有更多优化和进一步开发的空间。

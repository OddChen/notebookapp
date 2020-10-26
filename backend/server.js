//引入mongoose
const mongoose = require("mongoose");
//引入express
const express = require("express");
//引入body-parser
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
//express实例
const app = express();
//路由
const router = express.Router();
//定义MongoDB数据库
const dbRoute = "mongodb://localhost:27017/notebook";

mongoose.connect (
    dbRoute,
    {useNewUrlParser:true}
);

let db = mongoose.connection;
db.once("open", ()=>{console.log("connected to the database")});

//检测数据库是否连接成功
db.on("error",console.error.bind(console,"MongoDB connetion error:"));
//转换为可读的json格式
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//开启日志
app.use(logger("dev"));

//获取数据的方法
//用于获取数据库中所有可用数据
router.get("/getData", (req,res)=>{
    Data.find((err,data)=>{
        if(err) return res.json({success:false, error:err});
        return res.json({success:true, data: data});
    })
})

//数据更新方法
//用于对数据库中已有的数据进行更新
router.post("/updateData",(req,res)=>{
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, err=>{
        if(err) return res.json({success: false, error: err});
        return res.json({success:true});
    })
})

//删除数据方法
//用于删除数据库中已有数据
router.delete("/deleteData",(req,res)=>{
    const {id} = req.body;
    Data.findOneAndDelete(id, err=>{
        if(err) return res.send(err);
        return res.json({success:true});
    })
})

//添加数据
//用于在数据库中增加数据
router.post("/putData",(req,res)=>{
    let data = new Data();
    const {id, message} = req.body;
    if((!id&&id!==0)||!message){
        return res.json({
            success:false,
            error:"INVALID INPUTS"
        });
    }
    data.message = message;
    data.id = id;
    data.save(err=>{
        if(err) return res.json({success:false, error:err});
        return res.json({success:true});
    })
})

//对http请求增加/api路由
app.use("/api",router);
//开启端口
app.listen(API_PORT, ()=>{
    console.log(`LISTENING ON PORT ${API_PORT}`)
});
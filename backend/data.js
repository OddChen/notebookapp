const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

//数据结构
const DataSchema = new Scheme (
    {
        id: Number,
        message: String,
    },
    { timestamps: true }
);

//返回Schema,便于通过Node.js使用
module.exports = mongoose.model("Data", DataSchema);
import React, {Component} from 'react';
import axios from 'axios';
import { Button, Input, List, Avatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './NoteBook.css';

class NoteBook extends Component{
  state = {
    data:[],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  }
  
  //从数据库中获取已有的数据
  //添加轮询机制，用于检测数据库的数据，当数据发生更新时，重新渲染
  componentDidMount(){
    this.getDataFromDB();
    if(!this.state.intervalIsSet){
      let interval = setInterval(this.getDataFromDB,10000);
      this.setState({intervalIsSet: interval});
    }
  }
  componentWillUnmount(){
    if(this.state.intervalIsSet){
      clearInterval(this.state.intervalIsSet);
      this.setState({intervalIsSet:null});
    }
  }
  //在前台使用ID作为数据的key来辨识所需更新或删除的数据
  //在后台使用ID作为MongoDB中的数据实例的修改依据
  //getDataFromDB用于从数据库中获取数据
  getDataFromDB=()=>{
    fetch("/api/getData").then(data=>data.json()).then(res=>this.setState({data: res.data}))
  }
  
  //putDataToDB用于调用后台API接口向数据库新增数据
  putDataToDB=(message)=>{
    let currentIds = this.state.data.map(data=>data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)){
      ++idToBeAdded;
    }
    axios.post("/api/putData",{
      id: idToBeAdded,
      message,
    });
  };

  //deleteFromDB用于调研后台API删除数据库中已经存在的数据
  deleteFromDB=(idTodelete)=>{
    let objIdToDelete = null;
    this.state.data.forEach(dat=>{
      // console.log(dat.id===Number(idTodelete));
      if(dat.id===Number(idTodelete)){
        objIdToDelete = dat._id;
      }
    });
    axios.delete("/api/deleteData",{
      data: {
        id: objIdToDelete,
      }
    });
  };

  //updateDB用于更新数据库中已经存在的数据
  updateDB=(idToUpdate,updateToApply)=>{
    let objIdToUpdate = null;
    this.state.data.forEach(dat=>{
      if(dat.id===Number(idToUpdate)){
        objIdToUpdate = dat._id
      }
    })

    axios.post("/api/updateData",{
      id: objIdToUpdate,
      update:{ message: updateToApply }
    })
  }

  addNote=(e)=>{
    this.setState({
      message: e.target.value,
    })
  }
  delNote=(e)=>{
    this.setState({
      idToDelete: e.target.value
    })
  }
  updateNote=(e)=>{
    this.setState({
      idToUpdate: e.target.value
    })
  }
  updateApply=(e)=>{
    this.setState({
      updateToApply: e.target.value
    })
  }

  render(){
    const { data = [] } = this.state;
    return (
      <div className="NoteBook">
        <List
          className="list"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item=>(
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />}  />}
                title={<span>{`创建时间：${item.createdAt}`}</span>}
                description={`${item.id}:${item.message}`}
              />
            </List.Item>
          )}
        />
        <Card
          className="card"
          title="新增笔记"
        >
          <Input
            className="input"
            onChange={this.addNote}
            placeholder="请输入笔记内容"
          />
          <Button
            className="btn"
            type="primary"
            onClick={()=>this.putDataToDB(this.state.message)}
          >添加</Button>
        </Card>
        <Card
          title="删除笔记"
          className="card"
        >
          <Input
            className="input"
            onChange={this.delNote}
            placeholder="填写所需删除的ID"
          />
          <Button
            className="btn"
            type="primary"
            onClick={()=>{this.deleteFromDB(this.state.idToDelete)}}
          >删除</Button>
        </Card>
        <Card
          title="更新笔记"
          className="card"
        >
          <Input 
            className="input update"
            onChange={this.updateNote}
            placeholder="填写所需更新的ID"
          />
          <Input 
            className="input"
            onChange={this.updateApply}
            placeholder="请输入所需更新的内容"
          />
          <Button
            className="btn"
            type="primary"
            onClick={()=>this.updateDB(this.state.idToUpdate, this.state.updateToApply)}
          >更新</Button>
        </Card>
      </div>
    )
  }
}

export default NoteBook;

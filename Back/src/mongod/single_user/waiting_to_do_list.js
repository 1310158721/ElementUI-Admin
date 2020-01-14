const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class WAITINGTODOLIST {
  constructor() {
    this.app = global.APP;
    this.db = mongoose.createConnection(
      `mongodb://127.0.0.1:${global.mongoPort}/adminAllUser`,
      { useUnifiedTopology: true, useNewUrlParser: true }
    );

    // 代办事项数据结构 Schema
    this.WaitingToDoSchema = new Schema({
      createdTime: Number,
      status: String,
      content: String
    });

    this.WaitingToDoModel = this.db.model('single_user_waiting_to_do_list', this.WaitingToDoSchema);
  }

  /**
   * 获取列表数据
   */
  GetWaitingToDoList() {
    this.app.get('/api/getWaitingToDoList', (req, res, next) => {
      this.WaitingToDoModel.find()
        .then((doc) => {
          if (!doc.length) {
            res.send({
              result: null,
              msg: '获取待办事项列表失败',
              status: 400
            })
          } else {
            res.send({
              result: doc,
              msg: '获取待办事项列表成功',
              status: 0
            })
          }
        })
        .catch((err) => {
          res.send({
            result: err,
            msg: '获取待办事项列表成功',
            status: 0
          })
        })
    })
  }

  Start() {
    this.GetWaitingToDoList();
  };
}


const waitingToDoList = new WAITINGTODOLIST();
waitingToDoList.Start();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class WAITINGTODOLIST {
  constructor() {
    this.app = global.APP;
    this.db = mongoose.createConnection(
      `mongodb://127.0.0.1:${global.mongoPort}/adminWaitingToDo`,
      { useUnifiedTopology: true, useNewUrlParser: true }
    );

    // 代办事项数据结构 Schema
    this.WaitingToDoSchema = new Schema({
      createdTime: Number,
      status: String,
      statusDesc: String,
      content: String
    });

    // 需要动态获取数据库中的表
    // this.WaitingToDoModel = this.db.model('single_user_waiting_to_do_list', this.WaitingToDoSchema);
    this.WaitingToDoModel = null;
  }

  /**
   * 动态获取数据库中的表
   */
  setModel(token) {
    this.WaitingToDoModel = this.db.model(token + '_waiting_to_do_list', this.WaitingToDoSchema);
  }

  /**
   * 获取列表数据
   */
  GetWaitingToDoList() {
    this.app.get('/api/getWaitingToDoList', (req, res, next) => {
      const { token } = req.cookies;
      this.setModel(token);
      let { page, size, keyword = '', startTime = '', endTime = '', status = '' } = req.query;
      console.log(status);
      // 时间临界值处理
      startTime = startTime ? new Date(startTime + " 00:00:00") : null;
      endTime = endTime ? new Date(endTime + ' 23:59:59') : null;
      // 交集搜索条件
      const conditions = {
        // 搜索条件的交集 $and
        $and: [
          {
            // 关键字模糊搜索
            $or: [
              { content: { $regex: keyword, $options: '$i' } }
            ]
          }
        ]
      }
      // 添加时间段搜索
      if (startTime && endTime) {
        conditions.$and.push({ createdTime: {$gte: new Date(startTime), $lte: new Date(endTime)} })
      }

      // 添加状态搜索
      if (status) {
        conditions.$and.push({ status: status })
      }

      this.WaitingToDoModel.countDocuments(conditions)
        .then((count) => {
          this.WaitingToDoModel.find(conditions)
            .limit(Number.parseInt(size))
            .skip(Number.parseInt(page - 1) * size)
            .sort({ createdTime: -1 })
            .then((doc) => {
              if (!doc.length) {
                res.send({
                  result: {
                    list: [],
                    count
                  },
                  msg: '暂无该用户相关数据',
                  status: 0
                })
              } else {
                res.send({
                  result: {
                    list: doc,
                    count
                  },
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
        .catch((err) => {
          res.send({
            result: err,
            status: 400,
            msg: '获取列表数据条数出错'
          })
        })
    })
  }

  /**
   * 修改单条数据信息
   */
  UpdateWaitingItemStatus () {
    this.app.post('/api/updateWaitingItemStatus', (req, res, next) => {
      const { token } = req.cookies;
      this.setModel(token);
      const { status, _id } = req.body;
      this.WaitingToDoModel.findOneAndUpdate({ _id }, { status, statusDesc: status === '0' ? '已完成' : '未完成' })
        .then((doc) => {
          if (doc) {
            res.send({
              result: doc,
              msg: '修改单条数据成功',
              status: 0
            })
          } else {
            res.send({
              result: err,
              msg: '修改单条数据失败',
              status: 400
            })
          }
        })
        .catch((err) => {
          res.send({
            result: err,
            msg: '修改单条数据出错了',
            status: 400
          })
        })
    });
  }

  /**
   * 新增单条数据信息
   */
  AddWaitingItem() {
    this.app.post('/api/addWaitingItem', (req, res, next) => {
      const { token } = req.cookies;
      this.setModel(token);
      const { content } = req.body;
      const WaitingToDoModel = this.WaitingToDoModel;
      const addData = new WaitingToDoModel({
        content,
        createdTime: Date.now(),
        status: '1',
        statusDesc: '未完成'
      })
      addData.save()
        .then(() => {
          res.send({
            result: null,
            msg: '新增数据成功',
            status: 0
          })
        })
        .catch((err) => {
          res.send({
            result: err,
            msg: '新增数据失败',
            status: 400
          })
        })
    })
  }

  /**
   * 删除单条数据
   */
  DeleteWaitingItem () {
    this.app.get('/api/deleteWaitingItem', (req, res, next) => {
      const { token } = req.cookies;
      this.setModel(token);
      const { _id } = req.query;
      this.WaitingToDoModel.findByIdAndRemove(_id)
        .then(() => {
          res.send({
            result: null,
            msg: '删除数据成功',
            status: 0
          })
        })
        .catch((err) => {
          res.send({
            result: err,
            msg: '删除数据失败',
            status: 0
          })
        })
    })
  }

  Start() {
    this.GetWaitingToDoList();
    this.UpdateWaitingItemStatus();
    this.AddWaitingItem();
    this.DeleteWaitingItem();
  };
}


const waitingToDoList = new WAITINGTODOLIST();
waitingToDoList.Start();

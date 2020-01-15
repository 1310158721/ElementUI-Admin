const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const $axios = require('axios');

class USER {
  constructor() {
    this.app = global.APP;
    this.db = mongoose.createConnection(
      `mongodb://127.0.0.1:${global.mongoPort}/adminAllUser`,
      { useUnifiedTopology: true, useNewUrlParser: true }
    );

    // 用户数据结构 Schema
    this.UserSchema = new Schema({
      account: String,
      password: String,
      mobile: String,
      avatar: String,
      permission: String,
      desc: String,
      token: String,
      role: String,
      username: String,
      createdTime: Number
    });

    // 用户数据 Model(表的名称不能大写)
    this.UserModel = this.db.model('all_user_info', this.UserSchema);

    this.dealList = [];
  }
  
  // 处理用户权限的（暂时不使用）
  deal(list) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (!list[i].children || !list[i].children.length) {
        list[i].label = list[i].title;
        list[i].id = list[i].permission || null;
        delete list[i].title;
        delete list[i]._id;
        delete list[i].icon;
        delete list[i].permission;
      } else {
        list[i].label = list[i].title;
        list[i].id = list[i].permission || null;
        delete list[i].title;
        delete list[i]._id;
        delete list[i].icon;
        delete list[i].permission;
        this.deal(list[i].children);
      }
    }
  }

  /**
   * 用户登录接口
   */
  UserLogin() {
    this.app.get('/api/login', (req, res, next) => {
      const { account, password } = req.query;
      if (!account || !password) {
        res.send({
          result: null,
          status: 400,
          msg: '请输入账号和密码'
        });
        return false;
      }
      this.UserModel.find({ account, password })
        .then((doc) => {
          if (!doc.length) {
            res.send({
              result: null,
              status: 400,
              msg: '暂无该用户，请前往注册'
            });
          } else if (doc.length === 1) {
            const { token } = doc[0];
            // cookie 有效期 2h
            res.cookie('token', token, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 2)
            });

            res.send({
              result: null,
              status: 0,
              msg: '登录成功'
            });
          } else {
            res.send({
              result: null,
              status: 400,
              msg: '后台数据存在两个以上的该用户，前管理员前往处理'
            });
          }
        })
        .catch((err) => {
          console.log('error');
        })
    })
  }

  /**
   * 获取所有用户信息，用于展示权限列表
   */
  GetAllUserInfos() {
    this.app.get('/api/getAllUserInfos', (req, res, next) => {
      let { page = 1, size = 20, keyword = '', startTime = '', endTime = '', roleLevel = '' } = req.query;

      // 时间临界值处理
      startTime = startTime ? new Date(startTime + " 00:00:00") : null;
      endTime = endTime ? new Date(endTime + ' 23:59:59') : null;

      const conditions = {
        // 搜索条件的交集 $and
        $and: [
          {
            // 关键字模糊搜索
            $or: [
              { username: { $regex: keyword, $options: '$i' } },
              { desc: { $regex: keyword, $options: '$i' } }
            ]
          }
        ]
      }
      // 添加时间段搜索
      if (startTime && endTime) {
        conditions.$and.push({ createdTime: {$gte: new Date(startTime), $lte: new Date(endTime)} })
      }

      if (roleLevel) {
        conditions.$and.push({ role: roleLevel })
      }

      // 查询总条数
      this.UserModel.countDocuments(conditions).then((count) => {
        // 查询列表数据
        this.UserModel.find(conditions)
          .limit(Number.parseInt(size))
          .skip(Number.parseInt(page - 1) * size)
          .sort({createdTime: -1})
            .then((doc) => {
              res.send({
                result: {
                  list: doc,
                  count
                },
                status: 0,
                msg: '查询所有用户数据成功'
              })
            })
            .catch((err) => {
              res.send({
                result: err,
                status: 0,
                msg: '查询所有用户数据失败'
              })
            })
      });
    })
  }

  /**
   * 删除单个用户
   */
  DeleteSingleUser() {
    this.app.get('/api/deleteSingleUser', (req, res, next) => {
      const { roleId } = req.query;
      this.UserModel.findByIdAndRemove(roleId)
        .then(() => {
          res.send({
            result: null,
            status: 0,
            msg: '删除用户成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 0,
            msg: '删除用户失败'
          })
        })
    })
  }

  /**
   * 获取用户信息及权限列表，用于编辑权限
   */
  EditUserInfo () {
    this.app.get('/api/eidtUserInfo', (req, res, next) => {
      const { roleId } = req.query;
      if (!roleId) {
        res.send({
          result: null,
          status: 400,
          msg: '暂无该用户相关信息'
        })
        return;
      }
      /**
       * inside: 表示后端内部接口调用
       */
      $axios.get('http://127.0.0.1:9000/api/getMenuList', { params: { roleId, inside: true } })
        .then((response) => {
          const { status, result, msg } = response.data;
          // 处理 list 字段
          // const { list } = result;
          // this.deal(list);
          if (status === 0) {
            res.send({
              result,
              status: 0,
              msg
            })
          } else {
            res.send({
              result: null,
              status: 400,
              msg
            })
          }
        })
    });
  }

  /**
   * 查看单个用户信息
   */
  GetSingleUserInfo () {
    this.app.get('/api/getSingleUserInfo', (req, res, next) => {
      const { token } = req.cookies;
      this.UserModel.find({ token })
        .then((doc) => {
          if (!doc.length) {
            res.send({
              result: null,
              status: 400,
              msg: '暂无该用户相关信息'
            })
          } else {
            res.send({
              result: doc[0],
              status: 0,
              msg: '获取用户信息成功'
            })
          }
        })
        .catch((err) => {
          res.send({
            result: err,
            status: 400,
            msg: '获取单个用户相关信息失败'
          })
        })
    })
  }

  /**
   * 新增单个用户
   */
  AddSingleUser () {
    this.app.get('/api/addSingleUser', (req, res, next) => {
      const { account = '', password = '', role = '', username = '', permission = '', desc = '', mobile = '', avatar = ''  } = req.query;
      if (!account || !password || !role || !username || !permission || !desc || !mobile) {
        res.send({
          result: null,
          status: 0,
          msg: '必要参数不能为空'
        })
        return false;
      }
      // 查询待注册用户是否存在
      this.UserModel.find({ account })
        .then((doc) => {
          if (doc.length) {
            res.send({
              result: null,
              status: 400,
              msg: '该用户已存在'
            })
          } else {
            const singleDataUserModel = this.UserModel;
            const insertUser = new singleDataUserModel({ account, password, role, username, permission, desc, mobile, avatar, token: account, createdTime: Date.now() });
            insertUser.save()
              .then((doc) => {
                res.send({
                  result: null,
                  status: 0,
                  msg: '新增用户成功'
                })
              })
              .catch((err) => {
                res.send({
                  result: err,
                  status: 400,
                  msg: '新增用户失败'
                })
              })
          }
        })
        .catch((err) => {
          res.send({
            result: err,
            status: 0,
            msg: '新增时查询用户失败'
          })
        })
    })
  }

  /**
   * 更新单个用户信息，用于编辑权限列表后的更新
   */
  UpdateSingleUserInfo () {
    this.app.post('/api/updateSingleUserInfo', (req, res, next) => {
      const { username, desc, role, roleId, permission, account, avatar, mobile, password } = req.body;
      if (!username || !desc || !roleId || !role || !permission || !account || !mobile || !password) {
        res.send({
          result: null,
          status: 400,
          msg: '参数不能为空'
        });
        return;
      }
      this.UserModel.findByIdAndUpdate(roleId, { username, desc, role, roleId, permission, account, avatar, mobile, password })
        .then(() => {
          res.send({
            result: null,
            status: 0,
            msg: '用户信息更新成功'
          })
        })
        .catch((err) => {
          res.send({
            result: null,
            status: 400,
            msg: '用户信息更新失败'
          });
        })
    })
  }

  /**
   * 指定开启接口
   */
  Start() {
    this.UserLogin();
    this.GetAllUserInfos();
    this.DeleteSingleUser();
    this.EditUserInfo();
    this.UpdateSingleUserInfo();
    this.GetSingleUserInfo();
    this.AddSingleUser();
  }
}

const user = new USER();
user.Start();

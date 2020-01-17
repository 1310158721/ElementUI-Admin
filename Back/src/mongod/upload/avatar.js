const multer  = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

class UPLOAD {
  constructor() {
    this.app = global.APP;
  }

  UploadFiles() {
    this.app.post('/api/upload', upload.single('file'), (req, res, next) => {
      let file = req.file;
      /**
       * originalname 原名
       * destination 上传后保存的文件夹
       * path 上传后保存的路径
       * size 文件的大小
       */
      const { originalname, destination, filename, size } = file;

      if (size >= 1024 * 10) {
        res.send({
          result: null,
          status: 400,
          msg: '文件太大了'
        })
      } else {
        fs.rename(`${destination}${filename}`, `${destination}${originalname}`, (err) => {
          if (err) throw err;
          res.send({
            result: {
              url: `${req.protocol}://${req.hostname}:9000/${destination}${originalname}`,
              size
            },
            status: 0,
            msg: '上传成功'
          })
        });
      }
    })
  }

  Start() {
    this.UploadFiles();
  }
}

const myUpload = new UPLOAD();
myUpload.Start();

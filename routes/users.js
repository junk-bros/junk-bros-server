const UserModel = require("../models/users");
var SHA256 = require("crypto-js/sha256");

const userLogin = (req, res) => {
  let rs = { status: 0 };
  const { username, password } = req.body;
  if (!username || !password) {
    rs.message = "用户名或密码不能为空";
    res.json(rs);
  } else {
    UserModel.findOne({ username }).exec((err, user) => {
      if (err) {
        rs.message = err.message;
        res.json(rs);
      }
      if (user) {
        if (user.comparePassword(password)) {
          rs.status = 1;
          rs.user = user;
          rs.message = "登录成功";
        } else {
          rs.message = "用户名或密码错误";
        }
      } else {
        rs.message = "用户名不存在";
      }
      res.json(rs);
    });
  }
};

const getUsers = (req, res) => {
  let rs = { status: 0 };
  UserModel.find(null, null, (err, users) => {
    if (err) {
      rs.message = err.message;
    } else {
      rs.status = 1;
      rs.user = users;
    }

    res.json(rs);
  });
};

const createUser = (req, res) => {
  const UserEntity = new UserModel(req.body);
  UserModel.findOne({ username: req.body.username }, (err, row) => {
    if (row) {
      res.json({ status: 0, message: "用户名已存在" });
    } else {
      UserEntity.save(err => {
        if (err) {
          res.json({ status: 0, message: err.message });
        }
        res.json({ status: 1, message: "注册成功", user: UserEntity });
      });
    }
  });
};

const resetPassword = (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  let rs = { status: 0 };
  UserModel.findOne({ _id: id }, (err, row) => {
    if (row) {
      if (row.comparePassword(oldPassword)) {
        UserModel.updateOne(
          { _id: id },
          { password: SHA256(newPassword).toString() },
          err => {
            if (err) {
              rs.message = err.message;
            } else {
              rs.status = 1;
              rs.message = "密码修改成功";
            }
            res.json(rs);
          }
        );
      } else {
        rs.message = "旧密码输入有误";
        res.json(rs);
      }
    } else {
      rs.message = "error";
      res.json(rs);
    }
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { phone, email } = req.body;
  let rs = { status: 0 };
  UserModel.findOne({ _id: id }, (err, user) => {
    if (user) {
      UserModel.updateOne({ _id: id }, { phone, email }, (err, row) => {
        if (err) {
          rs.message = err.message;
          res.json(rs);
        } else {
          rs.status = 1;
          rs.user = Object.assign(user, { phone, email });
          rs.message = "个人资料修改成功";
        }
        res.json(rs);
      });
    } else {
      rs.message = "error";
      res.json(rs);
    }
  });
};

const getUser = (req, res) => {
  const { id } = req.params;
  let rs = { status: 0 };

  UserModel.findById({ _id: id }, (err, user) => {
    if (err) {
      rs.message = err.message;
    } else {
      rs.status = 1;
      rs.user = user;
    }

    res.json(rs);
  });
};

const saveFile = (req, res) => {
  const { id } = req.params;
  const { file } = req.body;
  let rs = { status: 0 };
  UserModel.findOne({ _id: id }, (err, user) => {
    if (user) {
      console.log(file);
      // 这里获取到file 并确认用户存在后，将文件传至S3
      rs.status = 1;
      res.json(rs);
    } else {
      rs.message = "user doesn't exist";
      res.json(rs);
    }
  });
};

module.exports = {
  userLogin,
  getUsers,
  createUser,
  resetPassword,
  updateUser,
  getUser,
  saveFile
};

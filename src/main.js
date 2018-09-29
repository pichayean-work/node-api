require("babel-register");
const express = require("express");
app = express(); //golbal
const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(
  express.urlencoded({
    extended: true //bodyend code
  })
);
app.use(express.json()); //json


const config = require("./config");
const Sequelize = require("sequelize");
const options = {
  operatorsAliases: false,
  dialect: "mysql",
  dialectOptions: {
    multipleStatements: true
  }
};
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  options
);
app.set("sequelize", sequelize);
app.get("/", (req, res) => {
  res.send("Hello World" + process.env.DEV_APP_PORT + process.env.NODE_ENV);
});

const cors = require("./middlewares/cors");
const preflight = require("./middlewares/preflight");
const jwt = require("./middlewares/jwt");
app.use(cors, preflight);

// setup modal
const Work = require("./models/work")();
const Account = require("./models/account")();
const User = require("./models/user")();
const Doit = require("./models/doit")();

// Account.sync({
//     force: true
// }) //ลบแล้วสร้าง table
Doit.sync();
Work.sync();
Account.sync();
User.sync();
// const router = require('./routes/product')
// const customer = require('./routes/customer')
// app.use("/api/v1/products", jwt, require("./routes/product"));
app.use("/api/v1/doits", require("./routes/doit"));
app.use("/api/v1/works", require("./routes/work"));
app.use("/api/v1/accounts", require("./routes/account"));
app.use("/api/v1/users", require("./routes/user"));

app.use(require("./middlewares/404"));

app.listen(config.app.port, function() {
  console.log("port : " + config.app.port);
  console.log("root_path : " + config.app.root_path);
});



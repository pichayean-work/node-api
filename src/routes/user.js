const router = require("express").Router();
const sequelize = app.get("sequelize");
const User = sequelize.models["user"];
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const results = await User.all();
    res.status(200).json(results);
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message
      })
      .end();
  }
});

//create
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const u = await User.findOne({ where: { username } });

    if (u) {
      res.status(401).json({message : 'User name นี้ไม่พร้อมให้ใช้งาน'}).end();
      return;
    }
    
    const user = await User.create({
      username,
      password: hash
    });

    res.status(201).json(user);
  } catch ({ message }) {
    res.status(500).json({
      message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username
      }
    });

    if (!user) {
      res.status(401).end();

      return;
    }

    if (!bcrypt.compareSync(password, user["password"])) {
      res.status(401).end();

      return;
    } else {
      const token = jwt.sign(
        {
          username: user.username
        },
        "SECRET",
        {
          expiresIn: 500
        }
      );
      res.json({
        id: user.id,
        username: user.username,
        token
      });
    }
  } catch ({ message }) {
    console.log(message)
    res.status(500).json({
      message
    });
  }
});

module.exports = router;

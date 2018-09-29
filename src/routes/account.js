const router = require("express").Router();
const sequelize = app.get("sequelize");
const Account = sequelize.models["account"];
const Encrypt = require("./../class/un-encrypt");

router.get("/", async (req, res) => {
  try {
    const _limit = parseInt(req.query.limit);
    const _page = parseInt(req.query.page);
    const _start = (_page - 1) * _limit;
    let _count = await Account.count({ where: { active: true } });
    _count = Math.ceil(parseInt(_count) / _limit);
    const results = await Account.findAll({
      offset: _start,
      limit: _limit,
      where: {
        active: true
      },
      order: [
            ['id', 'DESC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
      ],
    });
    res.status(200).json({ results, totalPage: _count});
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message
      })
      .end();
  }
});


router.get("/getAccountTotal", async (req, res) => {
  try {
    const _count = await Account.count({ where: { active: true } });
    res.status(200).json({ accountTotal: _count });
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message
      })
      .end();
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await Account.findById(id);
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const a = await Account.findById(id);

    if (!a) {
      res.status(404).end();

      return;
    }

    await a.update(data);

    res.status(200).json(data);
  } catch ({ message }) {
    res.status(500).json({
      message
    });
  }
});

//create
router.post("/", async (req, res) => {
  try {
    const { username, password, email, website, desc, start_date, expiry_date } = req.body;
    const EncryptPassword = Encrypt.encodeStr(password)
    const account = await Account.create({
      username,
      password : EncryptPassword,
      email,
      website,
      desc,
      start_date,
      expiry_date,
      active: true,
      user_id
    });

    res.status(201).json(account);
  } catch ({ message }) {
    res.status(500).json({
      message
    });
  }
});

router.post("/upload", function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  
  let File = req.files.file;

  File.mv("./filename.jpg", function(err) {
    if (err) return res.status(500).send(err);

    res.status(200).json({ message: "File uploaded!" });
  });
});


router.get("/displayPassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const a = await Account.findById(id);

    if (!a) {
      res.status(404).end();

      return;
    }
    const hasPassword = Encrypt.decodeStr(a.password);

    res.status(200).json({ hasPassword });
  } catch ({ message }) {
    res.status(500).json({
      message
    });
  }
});
module.exports = router;

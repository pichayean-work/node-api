const router = require("express").Router();
const sequelize = app.get("sequelize");
const Work = sequelize.models["work"];
const Encrypt = require("./../class/un-encrypt");

router.get("/", async (req, res) => {
  try {
    const _limit = parseInt(req.query.limit);
    const _page = parseInt(req.query.page);
    const _start = (_page - 1) * _limit;
    let _count = await Work.count({ where: { active: true } });
    _count = Math.ceil(parseInt(_count) / _limit);
    const results = await Work.findAll({
      offset: _start,
      limit: _limit,
      where: {
        active: true
      },
      order: [
        ['id', 'DESC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
      ],
    });
    res.status(200).json({ results, totalPage: _count });
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
    const { project_name, 
            hosting, 
            username, 
            password, 
            detail, 
            price, 
            customer_contact, 
            start_date, 
            expiry_date  
        } = req.body;

    const EncryptPassword = Encrypt.encodeStr(password);
    const w = await Work.create({
        project_name,
        hosting,
        username,
        password: EncryptPassword,
        detail,
        price,
        customer_contact,
        start_date,
        expiry_date,
        active: true,
        user_id
    });

    res.status(201).json(w);
  } catch ({ message }) {
    res.status(500).json({
      message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const a = await Work.findById(id);

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

router.get("/displayPassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const a = await Work.findById(id);

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

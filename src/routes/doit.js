const router = require("express").Router();
const sequelize = app.get("sequelize");
const Doit = sequelize.models["doit"];

router.get("/tags", async function (req, res) {
  try {
    const sql = `
    drop table if exists t;
    create table t( txt text );
    insert into t 
    SELECT GROUP_CONCAT(hashtag SEPARATOR ', ') as txt
    FROM doits 
    GROUP BY 'all';

    drop temporary table if exists temp;
    create temporary table temp( val char(255) );
    set @sql = concat("insert into temp (val) values ('", replace(( select group_concat(distinct txt) as data from t), ",", "'),('"),"');");
    prepare stmt1 from @sql;
    execute stmt1;
    select distinct(TRIM(val)) as hashtag from temp;
    `;
    let results = null
    await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, model: Doit }).then(doit => {
      results = doit;
    });
   
    res.status(200).json(results[results.length - 1]);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({
        error: e.message
      })
      .end();
  }
});
router.get("/", async (req, res) => {
  try {
    const _limit = parseInt(req.query.limit);
    const _page = parseInt(req.query.page);
    const _start = (_page - 1) * _limit;
    let _count = await Doit.count();
    _count = Math.ceil(parseInt(_count) / _limit);
    const results = await Doit.findAll({
      offset: _start,
      limit: _limit,
      order: [
        ["id", "DESC"] // Sorts by COLUMN_NAME_EXAMPLE in ascending order
      ]
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
router.get("/search", async (req, res) => {
  try {
    const _limit = parseInt(req.query.limit);
    const _page = parseInt(req.query.page);
    const _txtSearch = req.query.txtSearch;
    const _start = (_page - 1) * _limit;
    let _count = await Doit.count();
    _count = Math.ceil(parseInt(_count) / _limit);
    const Op = sequelize.Op;
    const results = await Doit.findAll({
      offset: _start,
      limit: _limit,
      order: [
        ["id", "DESC"] // Sorts by COLUMN_NAME_EXAMPLE in ascending order
      ],
      where: {
        [Op.or]: [
          {
            detail: {
              [Op.like]: `%${_txtSearch}%`
            }
          },
          {
            hashtag: {
              [Op.like]: `%${_txtSearch}%`
            }
          }
        ]
      }
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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await Doit.findById(id);
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
    let today = new Date().toLocaleDateString();
    var normalizedDate = new Date(Date.now()).toISOString();
    const { hashtag, categories, title, sub_title, detail, create_date, date_process, status, user_id } = req.body;

    const account = await Doit.create({
      hashtag,
      categories,
      title,
      sub_title,
      detail,
      create_date: sequelize.literal("CURRENT_TIMESTAMP"),
      date_process: today,
      status,
      user_id
    });

    res.status(201).json(account);
  } catch ({ message }) {
    res.status(500).json({
      message
    });
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    let doit = await Doit.findById(id);
    if (!doit) {
      res.status(404).end();

      return;
    }
    
    await doit.update({ detail: data.detail, hashtag: data.hashtag });

    res.status(200).json(data);
  } catch ({ message}) {
    console.log(message);
    res.status(500).json({ message });
  }
});

module.exports = router;

module.exports = (req, res, next) => {
    if (req.method != "OPTIONS") {
      next();
    }
    if (req.method == "OPTIONS") {
      res
        .set({
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        })
        .end();
    }
  };
  
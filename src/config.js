const config = {
  production:{
    app: {
      port: parseInt(process.env.DEV_APP_PORT) || 8074,
      root_path: `http://apinode.pichayean.com:${parseInt(process.env.DEV_APP_PORT) || 8074}`
    },
    db: {
      database: "me",
      username: "root",
      password: "ld4t5555"
    }
  },
  dev: {
    app: {
      port: parseInt(process.env.DEV_APP_PORT) || 8074,
      root_path: `http://localhost:${parseInt(process.env.DEV_APP_PORT) || 8074}`
    },
    db: {
      database: "me",
      username: "root",
      password: "ld4t5555"
    }
  }
}

module.exports = process.env.NODE_ENV == "production" ? config.production : config.dev;
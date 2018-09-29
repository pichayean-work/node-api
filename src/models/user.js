const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')
module.exports = () => {
    const fields = {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        username: Sequelize.STRING,
        password: Sequelize.STRING
    }
    const options = {
        timestamps: false
    }
    return sequelize.define('user', fields, options);
}
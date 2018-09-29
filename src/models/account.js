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
        password: Sequelize.STRING,
        email: Sequelize.STRING,
        website: Sequelize.STRING,
        desc: Sequelize.STRING,
        start_date: Sequelize.DATE,
        expiry_date: Sequelize.DATE,
        active: Sequelize.BOOLEAN,
        user_id: Sequelize.STRING
    }
    const options = {
        timestamps: false
    }
    return sequelize.define('account', fields, options);
}
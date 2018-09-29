const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')
module.exports = () => {
    const fields = {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        hashtag: Sequelize.STRING,
        categories: Sequelize.STRING,
        title: Sequelize.STRING,
        sub_title: Sequelize.STRING,
        detail: Sequelize.STRING,
        create_date: Sequelize.STRING,
        date_process: Sequelize.STRING,
        categories: Sequelize.STRING,
        status: Sequelize.STRING,
        user_id: Sequelize.STRING
    }
    const options = {
        timestamps: false
    }
    return sequelize.define('doit', fields, options);
}
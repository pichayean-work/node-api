const Sequelize = require('sequelize')
const sequelize = app.get('sequelize')
module.exports = () => {
    const fields = {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        project_name: Sequelize.STRING,
        hosting: Sequelize.STRING,
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        detail: Sequelize.STRING,
        price: Sequelize.STRING,
        customer_contact: Sequelize.STRING,
        start_date: Sequelize.DATE,
        expiry_date: Sequelize.DATE,
        user_id: Sequelize.INTEGER,
        active: Sequelize.BOOLEAN
    }
    const options = {
        timestamps: false
    }
    return sequelize.define('work', fields, options);
}
const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Task,
};

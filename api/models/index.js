const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.groupExpense = require("./groupExpense.model");
db.expense=require("./expense.model");
module.exports = db;
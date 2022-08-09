const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const groupExpense=mongoose.model(
    "groupExpense",
    new mongoose.Schema({
        tag:String,
        name:String,
        listUsers:[Schema.Types.ObjectId],
        listMoney:[{user1:Schema.Types.ObjectId, user2:Schema.Types.ObjectId,amount:mongoose.Decimal128}],
        history:[{_idExpense:Schema.Types.ObjectId}]
    })
)
module.exports = groupExpense;
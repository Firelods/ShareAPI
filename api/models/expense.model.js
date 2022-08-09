const mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const expense=mongoose.model(
    "expense",
    new mongoose.Schema({
        title:String,
        description:String,
        date:String,
        amount:mongoose.Decimal128,
        owner:Schema.Types.ObjectId,
        listUsers:[Schema.Types.ObjectId],
    })
)
module.exports = expense;
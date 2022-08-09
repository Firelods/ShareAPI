const config = require('../config/auth.config');
const db = require("../models");
const mongoose = require('mongoose');

const groupExpense = db.groupExpense;
const expense = db.expense;
const User = db.user;
exports.getGroupExpenses = (req, res) => {
    var o_id = mongoose.Types.ObjectId(req.params.user);
    console.log(o_id);
    groupExpense.find({
            listUsers: o_id

        })
        .then(function (expenses) {
            console.log(expenses)
            res.json(expenses);
        })
        .catch(function (error) {
            console.log(error)
        });
};

exports.getUserName = (req, res) => {
    var user = req.params.user;
    console.log(user);
    if (!user) {
        return res.status(400).json({
            error: "User not found"
        });
    }
    User.findOne({
        _id: user
    }).then(function (username) {
        console.log(username)
        res.json(username.username);
    });
};


exports.addExpense = (req, res) => {
    var o_id = mongoose.Types.ObjectId(req.params.group);
    console.log(o_id);
    const expenseNew = new expense({
        title: req.body.name,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        listUsers: o_id,
        owner: req.body.owner
    });
    console.log(req.body.name);
    expenseNew.save((err, expense) => {
        console.log(err);
        console.log(expense);
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        expenseNew.save(err => {
            if (err) {
                res.status(500).send({
                    message: err
                });
                return;
            }
            var o_id1 = mongoose.Types.ObjectId(req.body.group);
            groupExpense.findById(o_id1).then(function (group) {
                console.log("------------------");
                console.log(group);
                group.history.push({_idExpense:expenseNew._id});
                group.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    res.send({
                        message: "Expense was registered successfully!"
                    });
                });
            });
        });
    });
}
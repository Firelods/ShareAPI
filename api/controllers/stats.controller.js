const config = require('../config/auth.config');
const db = require("../models");
const mongoose = require('mongoose');
var jwt = require("jsonwebtoken");
const groupExpense = db.groupExpense;
const expense = db.expense;
const User = db.user;
exports.getGroupExpenses = (req, res) => {
    console.log(req.params)
    var o_id = mongoose.Types.ObjectId(req.params.user);
    if (verifyAccess(req.headers["access-token"])) {
        return res.status(401).json({
            title: 'Not Authenticated'
        });
    }
    console.log(o_id);
    groupExpense.find({
            listUsers: o_id

        })
        .then(function (expenses) {
            // console.log(expenses)
            res.json(expenses);
        })
        .catch(function (error) {
            console.log(error)
        });
};

exports.getUserName = (req, res) => {
    if (verifyAccess(req.headers["access-token"])) {
        return res.status(401).json({
            title: 'Not Authenticated'
        });
    }

    var user = req.params.user;
    if (!user) {
        return res.status(400).json({
            error: "User not found"
        });
    }
    User.findOne({
        _id: user
    }).then(function (username) {
        res.json(username.username);
    });
};

exports.getGroupExpense = (req, res) => { //return a groupExpense instance with id = req.params.id
    if (verifyAccess(req.headers["access-token"])) {
        return res.status(401).json({
            title: 'Not Authenticated'
        });
    }
    var o_id = mongoose.Types.ObjectId(req.params.id);
    console.log(o_id);
    var i = 0;
    groupExpense.findById(o_id).then(function (group) {
        res.json(group);
    }).catch(function (error) {
        console.log(error)
    })
}


exports.addExpense = (req, res) => {
    if (verifyAccess(req.headers["access-token"])) {
        return res.status(401).json({
            title: 'Not Authenticated'
        });
    }
    var listUserID = [];
    req.body.listUsers.forEach(function (user) {
        listUserID.push(mongoose.Types.ObjectId(user));
    });
    const expenseNew = new expense({
        title: req.body.name,
        description: req.body.description,
        date: req.body.date,
        amount: req.body.amount,
        listUsers: listUserID,
        owner: req.body.owner
    });
    expenseNew.save((err, expense) => {
        console.log(err);
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
                group.history.push({
                    _idExpense: expenseNew._id
                });
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
        updateListMoney(req.body.owner, listUserID, req.body.amount, req.body.group);
    });
}

function updateListMoney(user1, listUser, amount, group) //update the amount of money user1 owes to user2
{
    var o_id1 = mongoose.Types.ObjectId(user1);
    var o_id3 = mongoose.Types.ObjectId(group);

    groupExpense.findById(o_id3).then(function (group) {
        listUser.forEach(function (user) {
            var found = 0;
            group.listMoney.forEach(function (money) {
                if (money.user1.equals(o_id1) && money.user2.equals(user)) {
                    money.amount = parseInt(money.amount) + amount;
                    found = 1;
                }
            });
            if (found == 0) {
                group.listMoney.push({
                    user1: o_id1,
                    user2: user,
                    amount: amount
                });
            }
        });

        group.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    }).catch(function (error) {
        console.log(error)
    })
};


function verifyAccess(token) {

    var decoded = jwt.verify(token, config.secret, function (err, decoded) {
        // console.log(decoded)
        if (err) {
            // console.log(err)
            return true;
        } else {
            return false;
        }

    });
    return decoded;


}
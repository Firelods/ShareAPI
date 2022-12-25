const GroupExpense = require('../models/groupExpense.model');


exports.addGroupExpense = (req, res) => {
    const {
        name,
        currUser,

    } = req.body;

    // create a random tag to let new users join the group with a form like A56E85L7
    const tag = Math.random().toString(36).substring(2, 12).toUpperCase();
    console.log(tag);


    const groupExpense = new GroupExpense({
        tag: tag,
        name: name,
        listUsers: [currUser],
        listMoney: [],
        history: []
    });
    groupExpense.save((err, groupExpense) => {
        if (err) {
            res.status(500).send({
                message: err
            });
            return;
        }
        res.send({
            message: "GroupExpense was registered successfully!"
        });
    });
}
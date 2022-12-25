const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Group = db.groupExpense;
isUserConcerned = (req, res, next) => {
    let token = req.headers["access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        //collect group id from params
        const groupId = req.params.id;
        //check presence of userId in listUsers of group
        Group.findById(groupId).then(group => {
            if (!group) {
                return res.status(404).send({
                    message: "Group not found with id " + groupId
                });
            }
            const listUsers = group.listUsers;
            if (listUsers.includes(req.userId)) {
                console.log("Authorization successful");
                next();
            } else {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
        });

    });
    return;

};
const userAccept = {
    isUserConcerned,
};
module.exports = userAccept;
const controller = require("../controllers/stats.controller");
const {
    authJwt
} = require("../middlewares");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Origin', '*',
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/:user/groups", authJwt.verifyToken, controller.getGroupExpenses);
    app.get("/api/group/:id", authJwt.verifyToken, controller.getGroupExpense);
    app.post("/api/groups/addExpenses", authJwt.verifyToken, controller.addExpense);
    // app.post("/api/auth/signin", controller.signin);
};
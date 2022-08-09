const controller = require("../controllers/stats.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Origin', '*',
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/:user/groups",controller.getGroupExpenses);
    app.post("/api/groups/addExpenses",controller.addExpense);
    // app.post("/api/auth/signin", controller.signin);
};
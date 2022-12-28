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
    app.get("/api/user/:user", authJwt.verifyToken, controller.getUserName);
    app.post("/api/user/addGroup", authJwt.verifyToken, controller.addGroupToUser);
};
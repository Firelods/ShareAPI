const {
    verifySignUp
} = require("../middlewares");
const controller = require("../controllers/auth.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Origin', '*',
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        controller.signup
    );
    app.post("/api/auth/signin", controller.signin);
    app.get("/api/auth/google", controller.google);
    app.get("/api/auth/error", controller.error);
    app.get("/api/auth/google/callback", controller.googleCallback);
    app.get("/api/auth/google/success", controller.googleSuccess);
    app.get("/api/auth/test", controller.isConnected);

};
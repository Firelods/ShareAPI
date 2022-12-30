const controller = require("../controllers/stats.controller");
const groupController = require("../controllers/group.controller");
const { authJwt, userAccept } = require("../middlewares");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Origin",
      "*",
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/api/:user/groups",
    authJwt.verifyToken,
    controller.getGroupExpenses
  );
  app.get(
    "/api/group/:id",
    [authJwt.verifyToken, userAccept.isUserConcerned],
    controller.getGroupExpense
  );
  // get info of an expense
  app.get("/api/expense/:id", authJwt.verifyToken, controller.getExpense);
  app.post(
    "/api/groups/addExpenses",
    authJwt.verifyToken,
    controller.addExpense
  );
  app.post(
    "/api/groups/addGroup",
    // authJwt.verifyToken,
    groupController.createGroupExpense
  );
  // app.post("/api/auth/signin", controller.signin);
};

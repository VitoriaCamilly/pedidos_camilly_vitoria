const express = require("express");
const router = express.Router();

const usersController = require("./api/users/users.controller");
const productsController = require("./api/products/products.controller");
const ordersController = require("./api/orders/orders.controller");
const orderproductsController = require("./api/orderproducts/orderproducts.controller");

router.use("/users", usersController);
router.use("/products", productsController);
router.use("/orders", ordersController);
router.use("/ordersproducts", orderproductsController);

module.exports = router;
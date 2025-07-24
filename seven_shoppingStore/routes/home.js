// 1. Bring in express and express router
// 2. Bring in controller
// 3. Write the routes and use controllers
// 4. Export the routes

const express = require("express")
const router = express.Router()
const {home,dummy} = require("../controllers/homeController")


router.route("/").get(home)
router.route("/dummy").get(dummy)

module.exports = router
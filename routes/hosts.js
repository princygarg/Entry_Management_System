var express = require("express");
var router = express.Router({mergeParams: true});
const db = require("../connection");
const hostController = require("../controllers/hostController");

router.get("/", (req, res)=>{
	res.render("host");
});

router.post("/hostRegister", hostController.hostRegister);




module.exports = router;
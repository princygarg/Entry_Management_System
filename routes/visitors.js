var express = require("express");
var router = express.Router({mergeParams: true});

const visitorController = require("../controllers/visitorController");

router.get("/checkIn", (req, res)=>{
	res.render("visitor_checkIn");
});

router.get("/checkOut", (req, res)=>{
	res.render("visitor_checkOut");
});

router.post("/checkIn", visitorController.checkIn);
router.post("/checkOut", visitorController.checkOut);



module.exports = router;
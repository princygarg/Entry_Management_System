const db = require("../connection");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var Visitor = function(vis){
	this.visitor_name = vis.visitor_name;
	this.visitor_email = vis.visitor_email;
	this.visitor_phone = vis.visitor_phone;
	this.check_in = null;
	this.host_email = vis.host_email;
	this.passcode = vis.passcode;
};


Visitor.checkIn = (new_vis, result)=>{

	 
	new_vis.passcode = cryptr.encrypt(new_vis.passcode);
	db.query("INSERT INTO visitor set ?", new_vis, (err, success)=>{
		if(err){
			throw err;
		}
		else{
			// console.log("Query inserted successfully");
			// console.log(success);
			result(null,success.insertId);
		}
	});
}

Visitor.checkEmail = (email, result)=>{
	db.query("SELECT * from visitor where visitor_email='"+ email+"'", (err, res)=>{
		if(res.length > 0)
			result(null, res[0].email);
		else
			result(null, 0);
	});
}





Visitor.checkOut = (vis_info, result)=>{

	db.query("DELETE FROM visitor where visitor_email='"+vis_info.visitor_email+"'", (err, success)=>{
		if(err){
			throw err;
		}
		else{
			// console.log("Query deleted successfully");
			// console.log(success);
			result(null,success.affectedRows);
		}
	});
}

Visitor.get_details = (vis_info, result)=>{

	db.query("SELECT * from visitor where visitor_email='"+ vis_info.visitor_email+"'", (err, res)=>{
		// console.log(res[0]);
		if(res.length > 0)
			result(null, res[0]);
		else
			result(null, 0);
	});
}


module.exports = Visitor;
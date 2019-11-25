const db = require("../connection");

var Host = function(hst){
	this.host_name = hst.host_name;
	this.host_email = hst.host_email;
	this.host_phone = hst.host_phone;
};

Host.register = (new_hst, result)=>{

	db.query("INSERT INTO host set ?", new_hst, (err, success)=>{
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

Host.increase_visitor_count = (hst_email, result)=>{
	db.query("UPDATE host SET visitor_count=visitor_count+1 WHERE host_email='"+ hst_email+"'", (err, res)=>{
		result(null, res);
	});
}

Host.decrease_visitor_count = (hst_email, result)=>{
	db.query("UPDATE host SET visitor_count=visitor_count-1 WHERE host_email='"+ hst_email+"'", (err, res)=>{
		result(null, res);
	});
}

Host.assignHostToVisitor = (result)=>{
	db.query("SELECT * FROM host ORDER BY visitor_count ASC limit 1", (err, res)=>{
		// console.log(res[0].host_email);
		result(null, res[0]);
	});
}

Host.get_details = (hst_email, result)=>{
	db.query("SELECT * from host where host_email='"+ hst_email+"'", (err, res)=>{
		if(res.length > 0)
			result(null, res[0]);
		else
			result(null, 0);
	});
}

module.exports = Host;
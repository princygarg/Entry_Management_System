const db = require("../connection");
const Host = require("../models/hostModel");


exports.hostRegister = (req, res)=>{


	var new_hst = new Host(req.body);
	if(!new_hst.host_name || !new_hst.host_email || !new_hst.host_phone){	
		req.flash("error","Invalid inputs");
		res.redirect("/host");
	}else{
		Host.get_details(req.body.host_email, (err, result)=>{
			if(err){
				return res.status(500).json({error: err});
			}else{
				if(result != 0){
					req.flash("error","Host already registered");
					res.redirect("/host");	
				}else{

					Host.register(new_hst, (err, result)=>{
						if(err){
							console.log(err);
						}else{
							// console.log(result);
							req.flash("success","Successfully registered as " + new_hst.host_name);
							res.redirect("/");
						}
					});
				}
			}
		});
	}
}
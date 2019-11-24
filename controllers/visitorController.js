const Visitor = require("../models/visitorModel");
const Host = require("../models/hostModel");
const EmailSend = require("../emailsender");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

exports.checkIn = (req, res)=>{

	var new_vis = new Visitor(req.body);
	if(!new_vis.visitor_name || !new_vis.visitor_email || !new_vis.visitor_phone || !new_vis.passcode){
		req.flash("error","Invalid inputs");
		res.redirect("/visitor/checkIn");
	}else{

		Visitor.checkEmail(req.body.visitor_email, (err, result)=>{
			if(err){
				req.flash("error","Something went wrong... please try again");
				res.redirect("/");
			}else{
				if(result != 0){
					req.flash("error","Already checked-In");
					res.redirect("/visitor/checkIn");	
				}else{

					Host.check_host_Email(req.body.host_email, (err, result)=>{
						if(err){
							req.flash("error","Something went wrong... please try again");
							res.redirect("/");
						}else{
							if(result == 0 && req.body.host_email != null && req.body.host_email.length > 0){
								req.flash("error","Invalid Host Email!");
								res.redirect("/visitor/checkIn");	
							}else{

								if(req.body.host_email==null || req.body.host_email.length==0){

									Host.assignHostToVisitor((err, assignedHostEmail)=>{
										if(err){
											req.flash("error","Something went wrong... please try again");
											res.redirect("/");
										}else{
											new_vis.host_email = assignedHostEmail;
											Visitor.checkIn(new_vis, (err, result)=>{
												if(err){
													console.log(err);
												}else{
													const decryptedcode1 = cryptr.decrypt(new_vis.passcode);
													// console.log(decryptedcode);
													
													var data1 = {
														email: new_vis.visitor_email,
														subject: "Your Passcode Details",
														html: "<h2> Your Details: </h2> <p><strong>Name: </strong> "+ new_vis.visitor_name+"<br></p><p><strong>Passcode: </strong> "+ decryptedcode1 +"<br></p><p>Enter this during checkout.</p>"
													}
									
													EmailSend.sendEmail(data1, (err, result)=>{
														if(err){
															console.log(err);
														}
													})

													Host.increase_visitor_count(new_vis.host_email, (err, success)=>{
														if(err){
															return res.status(500).json({error: err});
														}
													});
													var data = {
														email: new_vis.host_email,
														subject: "New visitor arrived",
														html: "<h2> Visitor Details: </h2> <p><strong>Name: </strong> "+ new_vis.visitor_name+"<br></p><p><strong>Email: </strong> "+ new_vis.visitor_email+"<br></p><p><strong>Phone no.: </strong> "+new_vis.visitor_phone+
														"<br></p><p><strong>Check-in time: </strong>"+new Date()+"</p>"
													}
									
													EmailSend.sendEmail(data, (err, result)=>{
														if(err){
															console.log(err);
														}
													})
													req.flash("success","Successfully checked in as " + new_vis.visitor_name);
													res.redirect("/");
												}
											});
										}
									});
								}else{
								
									Visitor.checkIn(new_vis, (err, result)=>{
										if(err){
											console.log(err);
										}else{
											
											Host.increase_visitor_count(new_vis.host_email, (err, success)=>{
												if(err){
													return res.status(500).json({error: err});
												}
											});
											var data = {
												email: new_vis.host_email,
												subject: "New visitor arrived",
												html: "<h2> Visitor Details: </h2> <p><strong>Name: </strong> "+ new_vis.visitor_name+"<br></p><p><strong>Email: </strong> "+ new_vis.visitor_email+"<br></p><p><strong>Phone no.: </strong> "+new_vis.visitor_phone+
												"<br></p><p><strong>Check-in time: </strong>"+new Date()+"</p>"
											}
							
											EmailSend.sendEmail(data, (err, result)=>{
												if(err){
													console.log(err);
												}
											});
											req.flash("success","Successfully checked in as " + new_vis.visitor_name);
											res.redirect("/");
										}
									});
								}
							}
						}
					});

				}
			}
		});
	}
}

exports.checkOut = (req, res)=>{

	if(!req.body.visitor_email || !req.body.passcode)
	{
		req.flash("error","Invalid inputs");
		res.redirect("/visitor/checkOut");

	}else{
		Visitor.get_details(req.body, (err, userInfo)=>{
			if(userInfo == 0){
				req.flash("error","Invalid email or passcode!");
				res.redirect("/visitor/checkOut");	
			}else{

				const decryptedcode = cryptr.decrypt(userInfo.passcode);
				console.log(decryptedcode);
				if(decryptedcode != req.body.passcode){
					req.flash("error","Invalid email or passcode!");
					res.redirect("/visitor/checkOut");
				}else{
			
					Visitor.checkOut(req.body, (err, result)=>{
						if(err){
							console.log(err);
						}else{
							
							Host.get_details(userInfo.host_email, (err, host_data)=>{
								Host.decrease_visitor_count(host_data.host_email, (err, success)=>{
									if(err){
										return res.status(500).json({error: err});
									}
								});
								var data = {
									email: userInfo.visitor_email,
									subject: "Thanks for visiting!",
									html: "<h2>Your Check-out details:</h2> <p><strong>Name: </strong> "+ userInfo.visitor_name+"<br></p><p><strong>Phone no.: </strong> "+userInfo.visitor_phone+
									"<br></p><p><strong>Check-in time: </strong>"+userInfo.check_in+
									"<br></p><p><strong>Check-out time: </strong>" +new Date() +"<br></p><p><strong>Host Name:</strong> "+host_data.host_name+"<br></p><p><strong>Address visited:</strong> Innovacer, noida, Delhi."
								}
				
								EmailSend.sendEmail(data, (err, result)=>{
									if(err){
										console.log(err);
									}
								})
								
							});
							req.flash("success","Successfully checked out.... Thank you for visiting.");
							res.redirect("/");
						}
					});
				}
			}
		});
	}
}
const Visitor = require("../models/visitorModel");
const Host = require("../models/hostModel");
const EmailSend = require("../emailsender");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const SMSSend = require("../send_sms");

exports.checkIn = (req, res)=>{

	var new_vis = new Visitor(req.body);
	if(!new_vis.visitor_name || !new_vis.visitor_email || !new_vis.visitor_phone || !new_vis.passcode){
		req.flash("error","Invalid inputs");
		res.redirect("/visitor/checkIn");
	}else{

		// check visitor email is already in database or not.
		Visitor.checkEmail(req.body.visitor_email, (err, result)=>{
			if(err){
				req.flash("error","Something went wrong... please try again");
				res.redirect("/");
			}else{
				if(result != 0){
					req.flash("error","Already checked-In");
					res.redirect("/visitor/checkIn");	
				}else{

					//check host email is already in database or not.
					Host.get_details(req.body.host_email, (err, host_details)=>{
						if(err){
							req.flash("error","Something went wrong... please try again");
							res.redirect("/");
						}else{
							if(host_details == 0 && req.body.host_email != null && req.body.host_email.length > 0){
								req.flash("error","Invalid Host Email!");
								res.redirect("/visitor/checkIn");	
							}else{

								// is user does not enter any host email then we will provide host to him/her.
								if(req.body.host_email==null || req.body.host_email.length==0){

									Host.assignHostToVisitor((err, assignedHostDetail)=>{
										if(err){
											req.flash("error","Something went wrong... please try again");
											res.redirect("/");
										}else{
											if(assignedHostDetail == 0){
												req.flash("error","Host not available.");
												res.redirect("/visitor/checkIn");	
											}else{
												new_vis.host_email = assignedHostDetail.host_email;
												// visitor check in 
												Visitor.checkIn(new_vis, (err, result)=>{
													if(err){
														console.log(err);
													}else{
														const decryptedcode1 = cryptr.decrypt(new_vis.passcode);
														
														// send mail to visitor about the passcode info.
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

														// increment count of visitor assigned to that host by one.
														Host.increase_visitor_count(new_vis.host_email, (err, success)=>{
															if(err){
																return res.status(500).json({error: err});
															}
														});

														//send email to host about visitor details
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
														
														//send sms to host about visitor details
														const _phone_ = Number(assignedHostDetail.host_phone);
														var sms = {
															to: _phone_,
															body: "Visitor Details: Name: "+ new_vis.visitor_name + "Email: "+ new_vis.visitor_email + "Phone: " + new_vis.visitor_phone + "Check-in time: " + new Date()  
														}

														SMSSend.sendSMS(sms, (err, result)=>{
															if(err){
																console.log(err);
															}
														})
														
														req.flash("success","Successfully checked in as " + new_vis.visitor_name);
														res.redirect("/");
													}
												});
											}
										}
									});
								}else{
									//if visitor gave the information about host email
									Visitor.checkIn(new_vis, (err, result)=>{
										if(err){
											console.log(err);
										}else{

											const decryptedcode1 = cryptr.decrypt(new_vis.passcode);

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
											});
											
											const _phone_ = Number(host_details.host_phone);
											var sms = {
												to: _phone_,
												body: "Visitor Details: Name: "+ new_vis.visitor_name + "Email: "+ new_vis.visitor_email + "Phone: " + new_vis.visitor_phone + "Check-in time: " + new Date()  
											}

											SMSSend.sendSMS(sms, (err, result)=>{
												if(err){
													console.log(err);
												}
											})

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
		//to check details given by visitor for checkout
		Visitor.get_details(req.body, (err, userInfo)=>{
			if(userInfo == 0){
				req.flash("error","Invalid email or passcode!");
				res.redirect("/visitor/checkOut");	
			}else{
				//check visitor passcode is correct or not
				const decryptedcode = cryptr.decrypt(userInfo.passcode);
				
				if(decryptedcode != req.body.passcode){
					req.flash("error","Invalid email or passcode!");
					res.redirect("/visitor/checkOut");
				}else{
			
					Visitor.checkOut(req.body, (err, result)=>{
						if(err){
							console.log(err);
						}else{
							
							//fetching host details to decrease the counter variable of host and also to fetch the name of that host
							Host.get_details(userInfo.host_email, (err, host_data)=>{
								Host.decrease_visitor_count(host_data.host_email, (err, success)=>{
									if(err){
										return res.status(500).json({error: err});
									}
								});

								//send email to visitor about his/her check-out
								var data = {
									email: userInfo.visitor_email,
									subject: "Thanks for visiting!",
									html: "<h2>Your Check-out details:</h2> <p><strong>Name: </strong> "+ userInfo.visitor_name+"<br></p><p><strong>Phone no.: </strong> "+userInfo.visitor_phone+
									"<br></p><p><strong>Check-in time: </strong>"+userInfo.check_in+
									"<br></p><p><strong>Check-out time: </strong>" +new Date() +"<br></p><p><strong>Host Name:</strong> "+host_data.host_name+"<br></p><p><strong>Address visited:</strong> Innovacer, Noida, Delhi."
								}
				
								EmailSend.sendEmail(data, (err, result)=>{
									if(err){
										console.log(err);
									}
								})
								
								//send sms to visitor about his/her check-out
								var sms = {
									to: userInfo.visitor_phone,
									body: "Your check-out details: Name: " + userInfo.visitor_name +" Phone no.: " + userInfo.visitor_phone +" Check-in time: " + userInfo.check_in +" Check-out time: " + new Date() + " Host Name: " + host_data.host_name + " Address Visited: Innovacer, Noida, Delhi."
								}

								SMSSend.sendSMS(sms, (err, result)=>{
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
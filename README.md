# Entry management system

### DESCRIPTION

 -    A web application for the entry management. This must be installed at the main entrance of the company or at the entrance       of that place where the event will take place. 
 -    It is handled by the visitor himself/herself. There is no need for any third party to do this work. This way we can      reduce the labor cost.


### BASIC REQUIREMENTS

 - Node.js 12.13.1
 - MySQL database
 
**I am using `Twillio` (free trial) for SMS. And in that, user must be verified in the phone numbers list of API Holder's Twillio Account. I am unable to find any free API by which SMS messages can be send to any number. If you want to check my web application SMS module, then you have to register yourself into Twillio and get `accountSID`, `authorization token` and `phone number` from there and update these 3 things in `send_sms.js` file. Also, you have to verify phone numbers used for testing purpose here https://www.twilio.com/console/phone-numbers/verified.**

**Messages (SMS) are only delivered between the hours of 9 A.M. and 9 P.M. local Indian time.**


### Dependencies 
-   Update .env file
    -   Add your gmail id as `EMAIL_SENDER`.
    -   Add your gmail password as `EMAIL_KEY`.
    -   Allow less secure app emails on https://myaccount.google.com/u/0/lesssecureapps.
    -   create a account on Twillio and add your `ACC_SID`, `AUTH_TOKEN` and `AUTH_PHONE` for sms module working.
    -   verify phone numbers used for testing purpose here https://www.twilio.com/console/phone-numbers/verified.
-   For other dependencies refer Package.json


### INSTALLATION INSTRUCTIONS
-   Clone or download the repo. into your local system.
-   Cd into that root folder you just cloned locally.
-   install all dependencies which are written in the packet.json file, type
    ```
    npm install
    ```
-   Import innovacer_db into your MySql database.
-   Add database credentials to the connection.js file.
-   Now typing
    ```
    npm start
    ```
    will start a server !
    
-   App should now be running on **http://localhost:3000/**
         

### APPLICATION FEATUERES AND DETAILS

-   A new host can register him by clicking the **'Host Registration'** button.
---
-   Visitor can click on the **‘Visitor Check-in’** button and then enter the required details with a passcode which is required at the time of check-out. 
-   Passcode is added for security reasons so that no other person can check-out that visitor in unauthorized manner. 
-   Passcode is stored in **encrypted** form in the database in a secure manner. 
-   An email is sent to the visitor about the passcode so that if he forgets the passcode, he will check it.
---
-   **Visitors can add host email or our system will assign a host which has minimum visitors at that time to that visitor automatically.**
-   An email and SMS are sent to the host about the details of that visitor accordingly. 
---
-   For check-out click on the **‘Visitor Check-out’** button and then he has to enter his email ID with the passcode.
-   An email and SMS are sent to the visitor about his check-out details.

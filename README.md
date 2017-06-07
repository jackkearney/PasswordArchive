# PasswordArchive
Password Manager web app

## Summary

Created by Jack Kearney. Password Manager app to store passwords to different accounts. Created as a learning project using Grails on the backend and AngularJS along with UI-router on the front end. Runs everything on a local server in your filesystem. 

## Technical Information

The app is created using the Grails framework. The front end is run off a single minimal .gsp which the grails uses and then relies on AngularJS for the rest. Using bootstrap and custom css, the front end is based primarily in several html template files that it chooses between using a plugin called UI-Router. The angular uses ajax calls with json to communicate with the backend.

On the backend, there is a single master controller to handle all incomming requests. It uses a service to process all the tasks and access the database through Domains. Authentication is just using the session and there is no encryption on the passwords primarily because it wasn't a focus of the project and is all on a localhost anyway. 

The code for the controller and similarly the service on the backend is found in hello_world/grails_app/(controllers/hello_world/HelloController). All the front end code, spare the base index.gsp, can be found in web_app/*

## To run the app

clone or download the repo. Install grails version 2.5.0 from the dropdown menu at https://grails.org/download.html 

open a terminal/command line window and cd to the hello_world directory.

run the line: 
  `grails run-app`

open any web browser to http://localhost:8090/hello_world/Hello/index

## User Guide

Home Screen:
View all your accounts and passwords. You have the option to also store a url link to provide easy access. You can display the url or a shorter name. You can not have duplicate accounts with the same name. If you select on the heading for any column it will sort the information. If you select it again it will sort it in reverse order. The logout button is located at the top left along with a link to the profile page.

![home screen](https://github.com/jackkearney/PasswordArchive/blob/master/home_screen.png)

Select any entry to view the detailed information and edit any information. Similarly, use the Add New Entry button to create a new account. You can use also the button on the right of each row to delete an account.

![home screen edit view](https://github.com/jackkearney/PasswordArchive/blob/master/home_screen_edit.png)

Profile screen:
Visit the profile screen to change your username or password.

![profile screen](https://github.com/jackkearney/PasswordArchive/blob/master/profile.png)


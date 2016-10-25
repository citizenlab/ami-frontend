#AMI Frontend
AMI Frontend is an AngularJS application. The codebase is structured around being either served for development or compiled for production by the task-running system Grunt.

**This README assumes that you have set up an AMI System server environment per: https://github.com/andrewhilts/ami-server**. To learn about initally setting up and deploying the AMI Frontend, read that document.

This document describes the different components of the frontend and how they interoperate with AMI CMS and AMI Community Tools.

#User Interface
The AMI user interface are HTML files stored in app/views. They represent UI Views that contain Angular elements and variable placeholders.

##Internationalization
AMI is set up to be simple to internationalize. For this reason, all user interface strings for AMI for a given language are stored in a translation file. Translation files are JSON formatted. To add new translated strings to UI Views refer to the angular translate documentation.

To add a new supported language to the platform,

Add new Moment Locale
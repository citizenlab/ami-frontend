#AMI Frontend
AMI Frontend is an AngularJS application. The codebase is structured around being either served for development or compiled for production by the task-running system Grunt.

**This README assumes that you have set up an AMI System server environment per: https://github.com/andrewhilts/ami-server**. To learn about initally setting up and deploying the AMI Frontend, read that document.

This document describes the different components of the frontend and how they interoperate with AMI CMS and AMI Community Tools.

#Developer Environment
When developing AMI per the AMI System guidelines, you serve the application using `grunt serve` in the project root. When deploying on production, ansible runs `grunt build` to compile to project for production. Compiling concatenates and minifies JS, minifies images, and concatenates CSS, to help with performance.

#User Interface
The AMI user interface are HTML files stored in app/views. They represent UI Views that contain Angular elements and variable placeholders.

AMI Frontend styling is done primarily using the [Tachyons Verbose CSS](https://github.com/tachyons-css/tachyons-verbose/) framework.

##Internationalization
AMI is set up to be simple to internationalize. For this reason, all user interface strings for AMI for a given language are stored in a translation file.

To add a new supported language to the platform, edit your `host_vars` file in your `ami-system` project (See AMI System documentation). If developing locally, you can edit your `Vagrantfile` `ansible-playbook` value to match ami-frontend-update.yml, then run `vagrant provision` to exeute the playbook.

You'll then need to create a new JSON file in the `app/translations` folder called locale-{{newLanguageCode}}.json. It's easiest to copy from an existing translation file and start editing from there.

You'll then need to add a new language object to the `$scope.languages` object in `app/scripts/controllers/languages.js`. The language object's key needs to match the language code you define in your `host_vars` above.

To add new translated strings to UI Views refer to the angular translate documentation.

Add new Moment Locale

Assumes you will have an english version

# Updating a remove server
To update a remote server, run the `ami-frontend-update.yml` playbook in the ami-system root. First commit all your changes to the remote branch that your remote server is set to. Then run:

	ansible-playbook -i "yourhost" ami-frontend-update.yml
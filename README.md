# AMI Frontend
AMI Frontend is an AngularJS application. The codebase is structured around being either served for development or compiled for production by webpack.

## User Interface
The AMI user interface are HTML files stored in app/views. They represent UI Views that contain Angular elements and variable placeholders.

AMI Frontend styling is done primarily using the [Tachyons Verbose CSS](https://github.com/tachyons-css/tachyons-verbose/) framework.

## Internationalization
AMI is set up to be simple to internationalize. For this reason, all user interface strings for AMI for a given language are stored in a translation file.

You'll then need to create a new JSON file in the `app/translations` folder called locale-{{newLanguageCode}}.json. It's easiest to copy from an existing translation file and start editing from there.

To add new translated strings to UI Views refer to the angular translate documentation.

Add new Moment Locale

Assumes you will have an english version
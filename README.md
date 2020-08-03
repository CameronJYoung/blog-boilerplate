# Camerons Blog Boilerplate

This boilerplate code is to assist me in creating any static blog like websites/webapps. It will be built in a way where if you want to modify it to spit the files in a different format or use more plugins you can. 

The task runner and general base of the static site generator is gulp. This will allow me to add templating and any css/javascript build steps automatically.

In this project I aim to be using

 - Twig - for the templating
 - Babel - for the javascript
 - SCSS - as the css pre-processor
 - Bootstrap - easier and more consistant styling
 - Browsersync - To reload the page during development


I will list below how some of the basic mechanics works. This should be able to be used by most people that understand basic html. When this get's used in an actual website/blog or whatever and if there's any extra things in the readme needed, they should be added write at the bottom under the heading website specific. Does not apply to anyone viewing the public repo.

## Features
### Twig

In this section I will briefly describe how twig templating works to save any future confusion. The main directory for all our files is the app folder and the main folder for all the templates and pages is, you guessed it, the templates folder. To create a page you have to create a new html file (with the name you want it to be packaged as) in the pages folder. Each page will have a set of information you will have to define at the top, this may change depending on the specific website so it would be recomended that you copy another page file instead of creating it from scratch. I should probably eventually create a gulp task that creates a new html page. If you want to recreate some content over multiple pages for example a header, footer, etc.. you have to create an "include" html file. To me this is called a partial but whatever. To actually call one of these includes in code you need to use the twig syntax. An example of this is below:

``` 
{% include "../includes/someinclude.html" %}
```
If you want to set some data to re-use throughout a file you can set variables, I mentioned this briefly. The code for this is below (You can also search for the {% to see what else uses it):
```
{% set data = "Some Dynamic Data" %}
```
To then actually use this data you go in a page (or layout file!) use use this syntax:
```
{{ data }}
```

### SCSS




## Site Specific
# Camerons Blog Boilerplate

This project is to help anyone create static files for a blog/multiple page website.

The technologies I use in this are:
 - Gulp - I use this as a task runner to be able to run tasks with certain libraries/dependencies to achieve templating, css minification, etc.
 - SCSS - This is in case I ever want to use advanced scss styling features like loops. Also allows me to import bootstrap.
 - PostCSS - I use this so I can auto prefix and minify my css.
 - Bootstrap - This is a commonly used css framework that I decided to add to this so that it would be easier to standardize the styling seeing as this would be for a blog.
 - Twig - I will be using this as the templating engine as it allows me to have template variables,partials and layouts.
 - Babel & Babelify - This is so I can transpile and bundle my javascript.
 - Browser Sync - This allows me to have live reload and scss injection in dev mode.

Future Notes:
 - At some point it might be worth splitting the gulpfile in to multiple files.
 - Would also like to install a linting tool but a lot of people like to use their own so I may leave that to the person using this.
 - Have a look at image minification at some point



 The next part of this readme will be split into two sections. The first section will be how to use and modify the boilerplate and the second section will be a set of standards and requirements that you may not need to follow depending on the kind of projects but will help you in keeping all the code standard and clean.

 ## Part 1

 To run this build you need npm,node and the gulp cli

 My current versions are:

 ```
    node: v12.18.3 //https://nodejs.org/en/
    npm: 6.14.7 //Installed with node
    Gulp: 2.2.0 //https://gulpjs.com/docs/en/getting-started/quick-start
 ```

Once you have the above installed you need to install all the dependencies for this project. In the root of the folder use this command
```
    npm i
```

When that has finished you should be ready to start running the dev server and build the starting files. Here's all the gulp commands below (should be run in the root folder where you installed dependencies):
```
    //Run the dev server
    gulp
    gulp dev

    //Build the files
    gulp build

    //Delete the .tmp and dist folder
    gulp clean
```

### Creating new assets

If you want to create a new page you have to make a new html file in the directory: C:\Users\Cameron\Desktop\blog-boilerplate\app\templates\pages
To get a good grasp of how it works look at one of the pages already there. But essentially, there is 3 pieces of twig code that you need to add. At the top of the file you need to add this
```
    {% extends "../layouts/default.html"%}
```
This is what determines which layout your page will use. I will explain how to create a layout after. The next two pieces you need to add are
```
    {% block content %}

        // HTML code here

    {% endblock %}
```
As you can probably tell in this code snippet all the html code you want for that page should be put within these twig block content tags. Now that you have a html page with these three things and you're page content you should be able to run the dev server and then navigate to your page through the URL (or build to create the static file).

Now if you want to create a layout, which is the html content around your page for (example the body and header tags), you have to create a html file in this directory: 
C:\Users\Cameron\Desktop\blog-boilerplate\app\templates\layouts
Whatever name you make the html file is the name the page will look for in the twig extends template string. To see an example of a layout look at my default one. If you look at that file you may also notice I use another set of twig template strings. They will be explained below
```
    //This is where the content from the page will be inserted. Would typically be in the body
    {% block content %}{% endblock %}

    //These are twig variables that get replaced with whatever it is set to in the page. Have a look below to see how
    {{ pageName }}
    {{ title }}

    {% set pageName = "index" %} // this is how you set the variable, this is done at the top of the page file


    //This is how you include a partial (in twig they're called includes). You would replace "header" with whatever your partial html file name is. A partial is just a snippet of html code you want to re-use over multiple places/pages/layouts.
    {% include "../includes/header.html" %}
```

### Other assets

If you want to add images you can add per page images in the imgs>pages folder and any golbal images in the one above. If you want to add fonts just add them put them straight in the fonts folder but you can add a pages folder if you want. These will be moved for the dev and build tasks.

### Javascript

As for the javascript the way I have it setup right now is I have a variable at the top of the page with the pagename and I use that to define the script tags src. There is also a main js which is attached to everything in the layout. The javascript is transpiled and bundles per file and then put at the same level. This is so that I can do it in the same task. I recomend if you want to import any libraries do it where you need, if one page needs a certain library install the dependency via npm and import it there. If you want to use any of bootstraps javascript features you need to import jqery. I would do this in main.


## Part 2 (coming soon...)
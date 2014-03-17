# Journalism++

## How to add posts and pages
Pages and posts can be found in the `content` folder. 

### About posts
Post will be added to the main page carroussel if the subdomain is included into 
the posts meta (see #post meta) 

#### Post meta
```js
{
  "title": {
    "en":"Your post title in english",
    "fr":"Votre titre en français",
    // etc...
  },
  "thumbnail": "<the image to display into the carroussel>",
  "tags": ["an", "array", "of", "tags"],
  // will show the post on the given subdomains
  "domains": ["paris", "berlin", "amsterdam"],
  // (optional) if you want to disable the post set this key to true
  "disabled":true 
  // (optional) extra infos, not used
  "author": "@Pirhoo",
  "version": 2.0.1

}
```

## Installation
### Software dependencies
To make the project up and running, you need:

* **Node** 0.8.19
* **NPM** 1.1.32

### Step 1: Download the dependencies
The app is build at the top of the pleasant [Node Package Manager](http://npmjs.org/). To download and set up the whole dependancies three, simply run from the project's root directory :

    $ npm install

### Step 2: Edit the configuration
#### Use configuration file
The default configuration is present into *config/default.json*. Every modifications in this file will be commited. The *runtime.json* file is an auto-generated file that you shouldn't edit.

* **Development mode**: If you want to overide default values, you have to create a file named *config/development.json* and corresponding to your local configuration. This file will be ignored by git. 
* **Production mode**: if you want to overide default values, you have to edit the *config/production.json* file to fit with your production environment. This file will be ignored by git.

#### Alternative: use environment variables
The following environment variables can be use with the highest priority :

* **PORT** defines the port to listen to (ex: *80*);
* **NODE_ENV** defines the runtime mode that affects the configuration (ex: *development*, *production*, etc).

### Step 3: Add subdomains
If you want to see the chapter's sites, you need dedicated subdomains.
For local development, add for instance this line to your `/etc/hosts` file.

```
127.0.0.1       porto.jplusplus.dev
```

Subdomain should be in this switch case : https://github.com/jplusplus/jplusplus.org/blob/master/controllers/index.coffee#L27

Then you can request the page [porto.jplusplus.dev:3000](http://porto.jplusplus.dev:3000)

### Step 4: Run!
To launch the application enter the following command: 

    $ coffee app.coffee

Your application is now available from [localhost:3000](http://localhost:3000)!

## GNU General Public License
This software is the property of [Journalism++](http://jplusplus.org) and licensed under the [GNU Genral Public License](https://www.gnu.org/licenses/gpl-3.0.txt).
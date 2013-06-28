# README 
## How to add posts and pages to J++ 
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

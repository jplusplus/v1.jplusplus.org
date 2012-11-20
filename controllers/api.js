var rest = require('restler')
 , async = require('async')
 , cache = require('memory-cache');


module.exports=function() { };

/**
 * @author Pirhoo
 * @description Get the posts from the API or from the cache
 */
module.exports.getPosts = function(lang, complete) {

  async.series([
    // Get data from cache first
    function getFromCache(fallback) {      
      // Get the course from the cache
      if( !! cache.get('posts-list-'+lang) ) complete( cache.get('posts-list-'+lang) );
      // Or get the colletion from the fallback function
      else fallback();
    },
    // Get data from the API 
    function getFromAPI() {

      // get_category_index request from the external "WordPress API"
      rest.get("http://oeildupirate.com/jplusplus/?count=100&json=1&custom_fields=siteurl&lang=" + lang).on("complete", function(data) {

        // Filters custom fields
        for(var index in data.posts) {
          var post = data.posts[index];
          post.siteurl = post.custom_fields.siteurl ? post.custom_fields.siteurl[0] : false;
        }

        // Put the data in the cache 
        cache.put('posts-list-'+lang, data.posts);

        // Call the complete function
        complete( data.posts );

      });
    }        
  ]);

};


/**
 * @author Pirhoo
 * @description Get a page from the API or from the cache
 */
module.exports.getPage = function(id, lang, complete) {

  var cacheSlug = 'page-'+lang+'-'+id;

  async.series([
    // Get data from cache first
    function getFromCache(fallback) {      
      // Get the course from the cache
      if( !! cache.get(cacheSlug) ) complete( cache.get(cacheSlug) );
      // Or get the colletion from the fallback function
      else fallback();
    },
    // Get data from the API 
    function getFromAPI() {

      var uri  = "http://oeildupirate.com/jplusplus/";
          uri += isNaN( parseFloat(id) ) ? id + "?" : "?p=" + id;

      // get_category_index request from the external "WordPress API"
      rest.get(uri +"&json=1&lang=" + lang).on("complete", function(data) {

        // Put the data in the cache 
        cache.put(cacheSlug, data.page);

        // Call the complete function
        complete( data.page );

      });
    }        
  ]);

};
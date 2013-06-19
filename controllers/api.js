var rest = require('restler')
 , async = require('async')
 , cache = require('memory-cache')
, config = require('config');


module.exports=function() { };

/**
 * @author Pirhoo
 * @description Get the posts from the API or from the cache
 */
module.exports.getPosts = function(lang, city, complete) {

  var slug = 'posts-list-'+lang+'-'+city;

  async.series([
    // Get data from cache first
    function getFromCache(fallback) {      
      // Get the course from the cache
      if( !! cache.get(slug) ) complete( cache.get(slug) );
      // Or get the colletion from the fallback function
      else fallback();
    },
    // Get data from the API 
    function getFromAPI() {

      // get_category_index request from the external "WordPress API"
      rest.get(config.api + "tag/" + city +"/?count=100&json=1&custom_fields=siteurl&lang=" + lang).once("complete", function(data) {        
        // Filters custom fields
        for(var index in data.posts) {
          var post = data.posts[index];
          post.siteurl = post.custom_fields.siteurl ? post.custom_fields.siteurl[0] : false;
        }

        // Put the data in the cache 
        cache.put(slug, data.posts);

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
module.exports.getPage = function(id, ln, complete) {

  var cacheSlug = 'page-'+ln+'-'+id;

  if( !! cache.get(cacheSlug) ) return complete( cache.get(cacheSlug) );

  var uri  = config.api;
      uri += isNaN( parseFloat(id) ) ? id + "?" : "?p=" + id;

  // get_category_index request from the external "WordPress API"
  rest.get(uri +"&json=1&lang=" + ln).once("complete", function(data) {
    
    
    // We didn't find the page, try the english version
    if(!data.page && ln != "en") {
      module.exports.getPage(id, "en", complete);
    } else {
      if(data.page) data.page.lang = ln;     
      // Put the data in the cache 
      cache.put(cacheSlug, data.page);
      // Call the complete function
      complete( data.page );
    }

  });

};
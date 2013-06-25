
var fs = require('fs');
var async = require('async');
var marked = require('marked');
var cache = require('memory-cache');
var _ = require('underscore');

var contentPath = __dirname + '/../content/';

module.exports = function(){
  /**
   * Initialization of marked module
   *   Enable git flavor markdown (it's a bonus)
   */
  marked.setOptions({
    gfm: true
  });
};
/**
 * Return the content of 
 */
module.exports.getPage = function(page_name, lang, complete){
   async.series([
    // Get data from cache first
    function getFromCache(fallback) {
      var cache_key = 'page-' + page_name;
      // Get the course from the cache
      if( !! cache.get(cache_key) ){
        complete( cache.get(cache_key) );
      } 
      // Or get the colletion from the fallback function
      else {
        fallback();
      }
    },
    function getFromContent(){
      var cache_key = 'page-' +  page_name + '-' + lang;
      var page = getPage(page_name, lang);
      cache.put(cache_key, page);
      complete(page);
    }
  ]);
  
};
/** 
 * Return the list of post stored into /content/posts/
 */
module.exports.getPosts = function(lang, domain, complete){
  var post_paths = contentPath + 'posts/';
  async.series([
    // Get data from cache first
    function getFromCache(fallback) {
      var cache_key = 'posts-list-' + lang + '-' + domain;
      // Get the course from the cache
      if( !! cache.get(cache_key) ){
        console.log('getPost from cache ');
        complete( cache.get(cache_key) );
      } 
      // Or get the colletion from the fallback function
      else fallback();
    },
    function getFromContent(){
      getPosts(lang, domain, complete);
    }
  ]);
};

/**
 * Retrieve all elements from a directory 
 */ 
var getPosts = function(lang, domain, complete){
  var posts_path = contentPath + 'posts/';
  async.waterfall(
    [
      function listDir(getPostsMeta){
        fs.readdir(posts_path, getPostsMeta);
      },
      /** 
       * Read all posts meta from "posts/" folder
       */
      function getPostsMeta(elements, filterPosts){
        // console.log('getPosts.getPostsMeta - ', elements);
        async.map(elements, 
          function(element, addPost){
            var element_path = posts_path + element + '/';
            var post = {
              name: element,
              meta: getElementMeta(element_path),
              path: element_path
            };
            addPost(null, post);
          },function(error, results){
            filterPosts(null, results);
          }
        );
      },
      /** 
       * We filter posts if they are not from the requested domain
       */
      function filterPosts(posts, getPostsContent){
        async.filter(posts, 
          function(element, filter){
            var element_domain = element.meta.domain;
            var is_filtered = (_.isUndefined(element_domain)) || (element_domain !== domain);
            filter(!is_filtered);
          },
          function(results){
            getPostsContent(null, results);
          }
        );
      },
      /**
       * We get all post contents
       */
      function getPostsContent(posts, sendResults){
        async.map(posts,
          // map transform function for each post
          function(post, addPost){
            var content = fs.readFileSync(post.path + lang + '.md', "utf-8");
            var meta = post.meta; 
            var post = _.extend(post, {
              content: marked.parse(content),
              title: meta.title[lang],
              tags: meta.tags,
              thumbnail: meta.thumbnail 
            });
            addPost(null, post);
          },
          sendResults
        );
      },
    ],
    function sendResults(error, results){
      // console.log('getPosts.sendResult: results = ', results);
      if(results.length > 0){
        cache.put('posts-lists-'+lang, results);
      }
      onPostsRetrieved(results, lang, domain, complete);
    }
  );
};

/** 
 * Called after getPosts() as callback
 */
var onPostsRetrieved = function(posts, lang, domain, complete){
  var cache_key = 'posts-list-' + lang + '-' + domain;
  cache.put(cache_key, posts);
  complete(posts);
};


var getElementMeta = function(path){
  return require(path  + 'meta.json');
}

var getPage = function(element_dir, lang){
  var pages_path = contentPath + 'pages/'; 
  var page_path = pages_path + element_dir + '/';
  var meta = getElementMeta(page_path);
  var content = fs.readFileSync(page_path + lang + '.md', "utf-8");
  var page = {
    meta: meta,
    title: meta.title[lang],
    content: marked.parse(content)
  }
  return page;
};

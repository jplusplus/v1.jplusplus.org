
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
      _getPage(page_name, lang, complete);
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
        // console.log('getPost from cache ');
        complete( cache.get(cache_key) );
      } 
      // Or get the colletion from the fallback function
      else fallback();
    },
    function getFromContent(){
      _getPosts(lang, domain, complete);
    }
  ]);
};

/**
 * Retrieve all elements from a directory 
 */ 
var _getPosts = function(lang, domain, complete){
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
            _getPostContent(post, lang, addPost);
          },
          sendResults
        );
      },
    ],
    function sendResults(error, results){
      if(error){
        console.log(error);
      }
      // console.log('getPosts.sendResult: results = ', results);
      if(results.length > 0){
        cache.put('posts-lists-'+lang, results);
      }
      onPostsRetrieved(results, lang, domain, complete);
    }
  );
};

var _getPostContent = function(post, lang, complete){
  var defaultLanguage = "en";
  console.log('getPostContent - post: ', post.meta.title['en']);
  fs.readFile(post.path + lang + '.md', "utf-8", function(err, content, _post){
    if(!_post){
      _post = post;
    }
    if(!err){
      console.log('post: ', _post);
      var meta = _post.meta; 
      _post = _.extend(_post, {
        content: marked.parse(content),
        title: meta.title[lang],
        tags: meta.tags,
        thumbnail: meta.thumbnail 
      });
      complete(null, _post);
    } else {
      if (lang !== defaultLanguage) {
        _getPostContent(_post, defaultLanguage, complete);
      } else {
        error = new Error('Couldn\'t find english markdown file for post: ' + post);
        complete(error);
      }
    }
  });
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
  var meta;
  try {
    meta = require(path  + 'meta.json');
  } catch(e){
    console.log('ERROR - the requested meta at ', path, ' doesn\'t exist');
  }
  return meta;
}

var _getPage = function(page_name, lang, callback){
  var defaultLanguage = "en";
  var cache_key = 'page-' +  page_name + '-' + lang;
  var pages_path = contentPath + 'pages/'; 
  var page_path = pages_path + page_name + '/';
  var meta = getElementMeta(page_path);
  if(meta){
    fs.readFile(page_path + lang + '.md', "utf-8", function(err, content){
      if(!err) {
        var page = {
          meta: meta,
          title: meta.title[lang],
          content: marked.parse(content)
        };
        cache.put(cache_key, page);
        callback(page);
      } else {
        if(lang !== defaultLanguage){
          _getPage(page_name, defaultLanguage, function(page){
            if(page){
              cache.put(cache_key, page);
            }
            callback(page);
          });
        } else {
          callback();
        }
      }
    });
  } else {
    callback();
  }
};

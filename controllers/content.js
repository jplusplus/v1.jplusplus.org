
var fs = require('fs');
var async = require('async');
var marked = require('marked');
var cache = require('memory-cache');

var postsPath = __dirname + '/../content/posts/';

module.exports = function(){
  marked.setOptions({
    gfm: true
  });
};

module.exports.getPage = function(pageName, callback){

}
/** 
 * Return the list of post stored into /content/posts/
 */
module.exports.getPosts = function(lang, complete){
  async.series([
    // Get data from cache first
    function getFromCache(fallback) {      
      // Get the course from the cache
      if( !! cache.get('posts-list-'+lang) ){
        console.log(cache.get('posts-list-'+lang));
        complete( cache.get('posts-list-'+lang) );
      } 
      // Or get the colletion from the fallback function
      else fallback();
    },
    function getFromContent(){
      async.waterfall([
          function listPostsDir(callback){
              fs.readdir(postsPath, callback);
          },
          function readPosts(files, callback){
            async.map(files,
              function(file, callback){
                getPost(file, lang, callback);
              }, 
              callback);
          }
        ],
        function sendResult(results){
          if(typeof results !== "array"){
            results = [results];
          }
          if(results.length > 0){
            cache.put('posts-lists-'+lang, results);
          }
          complete(results);
        }
      );
    }
  ]);
};


var getPost = function(file, lang, callback){
  var post_dir  = postsPath + file + '/';
  var meta_post = require(post_dir  + 'meta.json');
  var content = fs.readFileSync(post_dir + lang + '.md', "utf-8");
  var title = meta_post.title[lang];
  var html = marked.parse(content);
  var post = meta_post;
  var error = null;
  if(title !== undefined){
    post.title = title;
  } else {
    error = new Error('Post from file "', file,'" has no title, please put an attribute called "title" in your meta.json');
  }
  post.content = html;
  callback(post);
};


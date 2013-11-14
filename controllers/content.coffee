_           = require("underscore")
async       = require("async")
cache       = require("memory-cache")
contentPath = __dirname + "/../content/"
fs          = require("fs")
marked      = require("marked")

module.exports = ->
  ###
  Initialization of marked module
  Enable git flavor markdown (it's a bonus)
  ###
  marked.setOptions gfm: true


###
Return the content of
###
module.exports.getPage = (page_name, lang, complete) ->

  # Get data from cache first
  async.series [getFromCache = (fallback) ->
    cache_key = "page-" + page_name

    # Get the course from the cache
    unless not cache.get(cache_key)
      complete cache.get(cache_key)

    # Or get the colletion from the fallback function
    else
      fallback()
  , getFromContent = ->
    getPageFromFile page_name, lang, complete
  ]


###
Return the list of post stored into /content/posts/
###
module.exports.getPosts = (lang, domain, complete) ->
  post_paths = contentPath + "posts/"
  cache_key = "posts-list-" + lang + "-" + domain
  # Get the course from the cache
  if cache.get(cache_key)
    complete cache.get(cache_key)
  # Or get the colletion from the fallback function
  else
    getPostsFromFiles lang, domain, complete


###
Retrieve all elements from a directory
###
getPostsFromFiles = (lang, domain, complete) ->
  posts_path = contentPath + "posts/"
  async.waterfall([
    (getPostsMeta) -> fs.readdir posts_path, getPostsMeta
    # Read all posts meta from "posts/" folder
    (elements, filterPosts) ->
      # console.log('getPosts.getPostsMeta - ', elements);
      async.map( elements, (element, addPost) ->
        element_path = posts_path + element + "/"
        post =
          name: element
          meta: getElementMeta(element_path)
          path: element_path

        addPost null, post
      , (error, results) -> filterPosts null, results)

    # We filter posts if they are not from the requested domain
    (posts, filterPost) ->
      async.filter(posts, (post, filter) ->
        console.log post
        post_domains = post.meta.domains
        filtered = true
        unless post.disabled
          _.each post_domains, (post_domain) ->
            filtered = false  if post_domain is domain

        filter not filtered
      , (results) -> filterPost null, results)

    # We sort the posts
    (posts, getPostsContent)->
      getPostsContent null, _.sortBy posts, (p)-> -1 * (new Date(p.meta.date).getTime())
    # We get all post contents
    (posts, sendResults) ->
      # map transform function for each post
      async.map posts, ((post, addPost) ->
        getPostContentExtended post, lang, addPost
      ), sendResults

  # Final callback
  ], (error, results) ->
    console.log error  if error
    cache.put "posts-lists-" + lang, results  if results.length > 0
    onPostsRetrieved results, lang, domain, complete
  )

getPostContentExtended = (post, lang, complete) ->
  defaultLanguage = "en"
  fs.readFile post.path + lang + ".md", "utf-8", (err, content, _post) ->
    _post = post  unless _post
    unless err
      meta = _post.meta
      title = meta.title[lang] or meta.title[defaultLanguage]
      _post = _.extend(_post,
        content: marked.parse(content)
        title: title
        lang: lang
        siteurl: meta.siteurl or false
        tags: meta.tags
        thumbnail: meta.thumbnail
      )
      complete null, _post
    else
      if lang isnt defaultLanguage
        getPostContentExtended _post, defaultLanguage, complete
      else
        complete null, null



###
Called after getPosts() as callback
###
onPostsRetrieved = (posts, lang, domain, complete) ->
  cache_key = "posts-list-" + lang + "-" + domain
  cache.put cache_key, posts
  complete posts

getElementMeta = (path) ->
  meta = undefined
  try
    meta = require(path + "meta.json")
  catch e
    console.log "ERROR - the requested meta at ", path, " doesn't exist"
  meta

getPageFromFile = (page_name, lang, callback) ->
  defaultLanguage = "en"
  cache_key = "page-" + page_name + "-" + lang
  pages_path = contentPath + "pages/"
  page_path = pages_path + page_name + "/"
  meta = getElementMeta(page_path)
  if meta
    fs.readFile page_path + lang + ".md", "utf-8", (err, content) ->
      unless err
        title = meta.title[lang] or meta.title[defaultLanguage]
        page =
          meta: meta
          title: title
          lang: lang
          content: marked.parse(content)

        cache.put cache_key, page
        callback page
      else
        if lang isnt defaultLanguage
          getPageFromFile page_name, defaultLanguage, (page) ->
            cache.put cache_key, page  if page
            callback page

        else
          callback()

  else
    callback()
const Watcher  = require('feed-watcher'),
    interval = 20, // seconds
    EventEmitter = require('events'),
    url = require('url'),
    http = require('http'),
    fileType = require('file-type'),
    axios = require('axios')


// WebFail Watcher exporter
module.exports = function (feed) {

  const eventer = new EventEmitter()
  const watcher = new Watcher(feed, interval)


  watcher.on('new entries', function (entries) {

    // DEBUG:
    console.log(`Received ${entries.length} new entries`)

    entries.forEach( async ({title, link}) => {


      // Extract the video path
      let videoLink = false
      try {
        const html = await axios.get(link)

        const ytMatch = html.data.match(/nocookie\.com\/embed\/([a-zA-Z\d_\-]+)/i)
        ytMatch.input = undefined
        console.log(ytMatch)
        if (ytMatch != null) {
          videoLink = `https://youtu.be/${ytMatch[1]}`
        }
      } catch (videDownloadError) {
        console.error(videDownloadError)
      }
      

      console.log('video: ', videoLink)


      // Extract the image path
      const postID = url.parse(link).path
      const imgUrl = `http://cdn.webfail.com/upl/img/${postID}/post2.jpg`

      http.get(imgUrl, res => {
        res.once('data', chunk => {
          res.destroy();
          const {mime} = fileType(chunk)

          console.log(`New entry "${title}" downloaded. emitting it.`)

          // emit an event
          eventer.emit('post', {
            title,
            link,
            imgUrl,
            isGif: (mime === 'image/gif' ? true : false),
            video: videoLink,
            id: postID
          })

        })
      })
    })
  })

  // Start watching the feed
  watcher
    .start()
    .then((posts) => {
      // posts are old posts
    })
    .catch(err => {
      console.error(err);
    })

  //watcher.emit('new entries', [{ title: 'asd', link: 'http://de.webfail.com/ff47f33a91e' }])



  // Return the event throwing object
  return eventer
}


// Stop watching the feed.
//watcher.stop()


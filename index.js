
const wfWatcher = require('./webfail_watcher.js')
const download  = require('download')
const fse       = require('fs-extra')
const tgBot     = require('node-telegram-bot-api')

// Create bot instance
const bot = new tgBot(process.env.WEBFAIL_BOT_TOKEN)

// Watch german webfail posts
/*
const deWatcher = new wfWatcher('https://de.webfail.com/rss')
deWatcher.on('post', post => postNewPost(post, process.env.WEBFAIL_DE_CHANNEL))
*/

// Watch english webfail posts
const enWatcher = new wfWatcher('https://en.webfail.com/rss')
enWatcher.on('post', post => postNewPost(post, process.env.WEBFAIL_EN_CHANNEL))



async function postNewPost({title, link, imgUrl, isGif, id}, channelId) {


  const params = {
    caption: `<a href="${link}">${title}</a>`,
    parse_mode: 'HTML'
  }

  // Post photo
  if (!isGif) {
    bot.sendPhoto(channelId, imgUrl, params)
  }

  // Post gif
  else {

    const dir = 'tmp/webfailgif'+id

    try {

      // Delete eventually existing old images
      try {
        await fse.remove(dir+'/post2.jpg')
      } catch (e2) {}

      // Download, change extension and send
      await download(imgUrl, dir)
      await fse.move(dir+'/post2.jpg',dir+'/post2.gif')
      await bot.sendDocument(channelId, dir+'/post2.gif', params)

    } catch (e) {
      console.log(e)
    } finally {
      try {
        // Remove image
        await fse.remove(dir+'/post2.gif')
        await fse.removeDir(dir+'/')
      } catch (e2) {}
    }


  }

}

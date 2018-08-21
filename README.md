Webfail Telegram Channel
========================

Webfail is a website to waste lifetime with GIFs, Tweets, YouTube Vids and other random shit postings.
If you want to waste your time instantly, why don't you forward all new webfail posts to a Telegram Channel?

This is exacly what this script does.

## Live version
This script is up and running (hopefully) and forwarding posts to
- https://t.me/webfail (German posts)
- https://t.me/webfailEN (English posts)


## Installation
1) Simply `git clone` this repository to a linux machine (please don't use a windows server) with NodeJS (and NPM) installed.
2) switch to the cloned directory and npm install (type `npm i`)
3) Run it with something like pm2 or foreverjs. You will need to provide 3 ENV variables (WEBFAIL_BOT_TOKEN, WEBFAIL_EN_CHANNEL, WEBFAIL_DE_CHANNEL). As you hopefully guessed, you will need a Telegram Bot token and two channels, where the bot is admin in.


## How it works
This script uses the feed-watcher module to wath the RSS feeds of webfail.com for new content. Every time a new post is found, the script will fetch the posts page to look for an embedded youtube player or a tweet link in the HTML. If found, it will add a link to the tweet or the youtube video. If none of these is the case, it will download the default image for this posts, and send it as a gif or jpeg to the channel.

## Contributing
If you like, you can pick one of those tasks and work on them:
- Download youtube videos, so users don't need to leave Telegram.
- Clean up code.

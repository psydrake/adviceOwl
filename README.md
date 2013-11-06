# Advice Owl

## About
Advice Owl is an advice column aggregator for mobile devices.

## Technical
Advice Owl is built for mobile devices using the Apache Cordova (a.k.a. PhoneGap) framework. It reads the RSS feeds of popular advice columns, using jGFeed - an abstraction layer on top of Google Feeds API - to process all the data in JSON on the client side. It uses jQuery and jQuery Mobile, to help make coding with JavaScript a pleasure.

Thanks to all the Open Source developers who contributed to the libraries that made this project possible!

## Project Structure
This project is organized to make use of the Cordova command line tools (version 3.1).
* `www`			- common web assets
* `merges/android`	- Android specific web assets to override those in `www`
* `merges/ios`		- iOS specific web assets to override those in `www`
* `platforms/android`	- Android specific files
* `platforms/ios`	- iOS / Xcode specific files
* `chrome`		- I put the files for the chrome hosted app here, including the manifest and icons in chrome/app

## Install On Your Phone / Tablet
* [Advice Owl for Android](https://play.google.com/store/apps/details?id=net.edrake.adviceowl)
* [Advice Owl for Kindle](http://www.amazon.com/Drake-Emko-Advice-Owl/dp/B00FTPNLES/ref=sr_1_1?s=mobile-apps&ie=UTF8&qid=1381829714&sr=1-1)

## Use As A Web App
* [Advice Owl in the Chrome Web Store](https://chrome.google.com/webstore/detail/advice-owl/pijbdbmaecnapkoefghdfiakpiiogeao)
* [Advice Owl as a Web Site](http://d2whqoo26gzkh3.cloudfront.net/adviceOwl/)

## Author
Drake Emko - drakee (a) gmail.com
* [@DrakeEmko](https://twitter.com/DrakeEmko)
* [Wolfgirl Band](http://wolfgirl.bandcamp.com/)
* [Hackles Comic](http://hackles.org/)
* [The Remonstrance Comic](http://theremonstrance.com/)

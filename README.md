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
* `chrome`		- files for the Chrome hosted web app
* `chrome/app`		- metadata files for the Chrome hosted web app, including the manifest and icons

## Building and Running
I originally wrote AdviceOwl using Apache Cordova 2.9 solely for Android. I later reorganized it to use [Apache Cordova 3.1](http://cordova.apache.org/docs/en/3.1.0/) for multiple Operating Systems, and have been building and running the project using the [Cordova 3.1 CLI](http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface).

If you don't have Cordova 3.1 installed, follow the [CLI instructions](http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface). If you have an older version, you can [upgrade](http://cordova.apache.org/blog/releases/2013/10/02/cordova-31.html). If, by the time you read this, there is a newer version of Cordova, you can probably use that :).

I have had success running the project on a virtual iPhone as well as my physical Android phone. On the command line, within the project directory:
* iOS - `cordova emulate ios --verbose`
* Android (plug your phone into your computer) - `cordova run android --verbose`

**UPDATE:** I updated cordova to version 3.5. Here are some issues that I've seen since then:
* For Android: If you run `cordova build android` and get the error: "platforms/android/ant-build/AndroidManifest.xml:2: error: Error: Float types not allowed (at 'versionCode' with value 'NaN').",
	run the `./setVersion.sh` script to overwrite the NaN value in that file.
* For iOS: If you run `cordova build ios`, be sure to run the `./fixIOSBuild.sh` script afterward - it fixes the incorrect casing for the app identifier that cordova automatically generates.

## Install On Your Phone / Tablet
* [Advice Owl for Android](https://play.google.com/store/apps/details?id=net.edrake.adviceowl)
* [Advice Owl for iOS](https://itunes.apple.com/us/app/advice-owl/id739076106?ls=1&mt=8)
* [Advice Owl for Windows Phone](http://www.windowsphone.com/en-us/store/app/advice-owl/5a4272fc-9ba8-42cd-82c7-b341cfb4973a)
* [Advice Owl for Kindle](http://www.amazon.com/Drake-Emko-Advice-Owl/dp/B00FTPNLES/ref=sr_1_1?s=mobile-apps&ie=UTF8&qid=1381829714&sr=1-1)
* [Advice Owl for Firefox OS](https://marketplace.firefox.com/app/advice-owl)
* [Advice Owl for Blackberry 10](http://appworld.blackberry.com/webstore/content/43831887/)

## Use As A Web App
* [Advice Owl in the Chrome Web Store](https://chrome.google.com/webstore/detail/advice-owl/pijbdbmaecnapkoefghdfiakpiiogeao)
* [Advice Owl as a Web Site](http://dznxs8nwc537r.cloudfront.net/)

## Author
Drake Emko - drakee (a) gmail.com
* [@DrakeEmko](https://twitter.com/DrakeEmko)
* [Wolfgirl Band](http://wolfgirl.bandcamp.com/)
* [Hackles Comic](http://hackles.org/)
* [The Remonstrance Comic](http://theremonstrance.com/)

# Advice Owl

## About
Advice Owl is an advice column aggregator for mobile devices.

## Technical
Advice Owl is built for mobile devices using the Apache Cordova (a.k.a. PhoneGap) framework. It reads the RSS feeds of popular advice columns, using jGFeed - an abstraction layer on top of Google Feeds API - to process all the data in JSON on the client side. It uses jQuery and jQuery Mobile, to help make coding with JavaScript a pleasure.

Thanks to all the Open Source developers who contributed to the libraries that made this project possible!

## Project Structure
This project is organized to make use of the Cordova command line tools (version 3.1).
* `www`					- common web assets
* `merges/android`		- Android specific web assets to override those in `www`
* `merges/ios`			- iOS specific web assets to override those in `www`
* `merges/wp8`			- Windows Phone 8 specific web assets to override those in `www`
* `platforms/android`	- Android specific files
* `platforms/ios`		- iOS / Xcode specific files
* `platforms/wp8`		- Windows Phone 8 specific files
* `webapp`				- files for hosted web app (Chrome, Firefox OS)
* `webapp/chrome`		- metadata files for the Chrome hosted web app, including the manifest and icons

## Building and Running
I originally wrote AdviceOwl using Apache Cordova 2.9 solely for Android. I later reorganized it to use [Apache Cordova 3.1](http://cordova.apache.org/docs/en/3.1.0/) for multiple Operating Systems, and have been building and running the project using the [Cordova 3.1 CLI](http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface).

If you don't have Cordova 3.1 installed, follow the [CLI instructions](http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface). If you have an older version, you can [upgrade](http://cordova.apache.org/blog/releases/2013/10/02/cordova-31.html). If, by the time you read this, there is a newer version of Cordova, you can probably use that :).

**UPDATE:** This project now uses [Cordova 6.5.0](https://www.npmjs.com/package/cordova).

I have had success running the project on a virtual iPhone as well as my physical Android phone. On the command line, within the project directory:
* **iOS:**
  `cordova emulate ios --verbose`
  * **NOTE For iOS** (a reminder to myself before uploading the app package to iTunes connect):
    * Run the `./fixIOSBuild.sh` script before running `cordova build ios` - it fixes the incorrect casing for the app identifier that cordova automatically generates.
    * After successfully packaging the app for iOS, run `./revertPackageName.sh` to revert the parts of `./fixIOSBuild.sh` that affect Android, so your next Android build will be successful.
  * **NOTE:** This system is terrible, but I made the mistake of provisioning Advice Owl's bundle/app ID as `net.edrake.AdviceOwl` instead of `net.edrake.adviceowl` on Apple's developer site, so here we are.


* **Android (plug your phone into your computer):**
  `cordova run android --verbose`
  * UPDATE: `cordova emulate android --verbose` works for me, as of Cordova 6.5.0
  * **NOTE for Android:**
    * If you run `cordova build android` and get the error: "platforms/android/ant-build/AndroidManifest.xml:2: error: Error: Float types not allowed (at 'versionCode' with value 'NaN').",
      run the `./setVersion.sh` script to overwrite the NaN value in that file.

## Install On Your Phone / Tablet
* [Advice Owl for Android](https://play.google.com/store/apps/details?id=net.edrake.adviceowl)
* [Advice Owl for iOS](https://itunes.apple.com/us/app/advice-owl/id739076106?ls=1&mt=8)
* [Advice Owl for Kindle](http://www.amazon.com/Drake-Emko-Advice-Owl/dp/B00FTPNLES/ref=sr_1_1?s=mobile-apps&ie=UTF8&qid=1381829714&sr=1-1)
* [Advice Owl for Firefox OS](https://marketplace.firefox.com/app/advice-owl)

**UPDATE:** Because Google decommissioned the [jGFeed](https://gist.github.com/psynewave/4220821) API service, which the original version of this app used for reading RSS feeds, I had to change the app to read from my personal feed aggregation service (served out of an Amazon S3 bucket). This works great, but these app platforms have not yet been updated and will not work at the present time:
  * [Advice Owl for Windows Phone](http://www.windowsphone.com/en-us/store/app/advice-owl/5a4272fc-9ba8-42cd-82c7-b341cfb4973a)
  * [Advice Owl for Blackberry 10](http://appworld.blackberry.com/webstore/content/43831887/)

## Use As A Web App
* [Advice Owl in the Chrome Web Store](https://chrome.google.com/webstore/detail/advice-owl/pijbdbmaecnapkoefghdfiakpiiogeao)
* [Advice Owl as a Web Site](http://dznxs8nwc537r.cloudfront.net/)

## Author
Drake Emko - drakee (a) gmail.com
* [@DrakeEmko](https://twitter.com/DrakeEmko)
* [Wolfgirl Band](http://wolfgirl.bandcamp.com/)
* [Hackles Comic](http://hackles.org/)

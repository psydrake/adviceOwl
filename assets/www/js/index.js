/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("menubutton", menuKeyDown, false);
        document.addEventListener("backbutton", backKeyDown, false);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        //console.log('Received Event: ' + id);        
    }
};

function menuKeyDown() {
	if ($('#menu').is(':visible')) { // hide menu if it is showing
		$('#menu').slideUp('fast');
	}
	else { // show menu 
		$('#menu').slideDown('fast');
	}
	return false;
}

function backKeyDown() {
	var exit = true;
	if ($('#menu').is(':visible')) {
		$('#menu').hide();
		exit = false;
	}
	if ($('#aboutDialog').is(':visible')) {
		window.history.back();
		exit = false;
	}
	if (!exit) {
		return false; // back button was used to exit a menu, don't exit app
	}

	return exitApp();
}

function exitApp() {
	navigator.app.exitApp();
	return true;
}

var DEFAULT_VERSION_NAME = '1.1';
var MILLISECONDS_WAIT = 6000; // base amount of time to wait between the start of feed displaying and the sort operation
var MILLISECONDS_BETWEEN_REFRESH = 1000 * 60 * 60; // do a content refresh if it's been 1 hour since the last cache update
var NUM_ENTRIES_PER_COLUMN = 3;
var feedList = [{name: 'Dear Prudence', url: 'http://www.slate.com/articles/life/dear_prudence.fulltext.all.10.rss', image: 'prudie.jpg'},
                {name: 'Ask Amy', url: 'http://amydickinson.com/rss', image: 'amy_dickenson.jpg', filter: {category: 'Ask Amy'}},
	            {name: 'Carolyn Hax', url: 'http://feeds.washingtonpost.com/rss/linksets/lifestyle/carolyn-hax', image: 'hax.jpg'},
	            {name: 'Savage Love', url: 'http://www.thestranger.com/gyrobase/Rss.xml?category=258', image: 'savage.jpg'},
	            {name: "Annie's Mailbox", url: 'http://www.creators.com/advice/annies-mailbox.rss', image: 'annies.jpg'},
	            {name: 'Dear Margo', url: 'http://www.creators.com/advice/dear-margo.rss', image: 'margo.jpg'},
	            {name: 'Miss Information', url: 'http://www.nerve.com/taxonomy/term/95215/all/feed', image: 'miss_information.jpg'},
	            {name: 'Questionable Advice', url: 'http://www.creators.com/advice/questionable-advice.rss', image: 'jessica_leigh.jpg'},
	            {name: 'The Advice Goddess', url: 'http://www.creators.com/advice/advice-goddess-amy-alkon.rss', image: 'amy_alkon.jpg'},
	            {name: 'Tales From The Front', url: 'http://www.creators.com/advice/tales-from-the-front.rss', image: 'cheryl_lavin.jpg'},
	            {name: 'At Work', url: 'http://www.creators.com/advice/at-work-lindsey-novak.rss', image: 'lindsey_novak.jpg'},
	            {name: 'The Awl', url: 'http://feeds.feedburner.com/TheAwl?format=xml', image: 'the_awl.png', filter: {category: 'Advice'}}];

function displayAbout() {
	$('#menu').hide();
	$.mobile.changePage("#aboutDialog");
	return false;
}

function scrollToTop() {
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	return false;
}

function refreshColumns() {
	$('#menu').hide();
	loadColumns(true);
	return scrollToTop();
}

function loadColumns(forceRefresh) {	 
	$('#ajax-loader').show('slow');

	var adviceContent;
	if (store) { // Get and use any cached content. Set forceRefresh to true if enough time has passed
		adviceContent = store.get('adviceContent');
		//console.log('content from cache: ' + adviceContent);
		if (adviceContent) {		
			$("#adviceContent").html(adviceContent);
			//console.log('read adviceContent from cache');			
		}
		var now = new Date().getTime();
		var lastUpdated = store.get('lastUpdated');
		if (!lastUpdated) {
			lastUpdated = 0;
		}
		lastUpdated = new Number(lastUpdated); // force lastUpdated to be a number
		//console.log('seconds until refresh: ' + ((lastUpdated + MILLISECONDS_BETWEEN_REFRESH) - now) / 1000);
		if (now > lastUpdated + MILLISECONDS_BETWEEN_REFRESH) {
			//console.log('setting forceRefresh to true');
			forceRefresh = true;
		}
	}

	//console.log('forceRefresh? ' + forceRefresh + ', adviceContent? ' + (adviceContent ? true : false));
	if (forceRefresh || !adviceContent) {
		for (i = 0; i < feedList.length; i++) {
			displayColumnEntries(feedList[i]['name'], feedList[i]['url'], feedList[i]['image'], feedList[i]['filter']);
		}
		window.setTimeout('sortElements()', MILLISECONDS_WAIT);
		window.setTimeout('cleanupOldColumnEntries()', MILLISECONDS_WAIT + 1500);
		window.setTimeout('saveColumnEntriesToCache()', MILLISECONDS_WAIT + 3500);
	}
	else {
		$('#ajax-loader').fadeOut('slow');
	}
}

function sortElements() {
	$('#adviceList li').sort(function(a, b) {
	    return a.dataset.timestamp > b.dataset.timestamp ? -1 : 1;
	}).appendTo('#adviceList');

	$('#ajax-loader').fadeOut('slow');
}

function cleanupOldColumnEntries() {
	var maxEntries = feedList.length * NUM_ENTRIES_PER_COLUMN;
	$("#adviceList li").each(function( index ) {
		  if (index > maxEntries) {
			  //console.log('in cleanupOldColumnEntries() - max of ' + maxEntries + ' reached. Deleting entry ' + index)
			  $(this).remove();
		  }
	});
}

function saveColumnEntriesToCache() {
	if (store) {
		var adviceContent = $("#adviceContent").html();
		if (adviceContent) {
			store.set('adviceContent', adviceContent);
			store.set('lastUpdated', new Date().getTime())
			//console.log('set adviceContent to cache');
		}
	}
}

function loadAbout() {
	$('#aboutList').append('<li><strong>Columns:</strong> ' + buildColumnNames() + '</li>');
	
	var versionName = DEFAULT_VERSION_NAME;
	if (window.AdviceOwl.getVersionName) {
		versionName = window.AdviceOwl.getVersionName();
	}
	$('#versionName').text(versionName);
	
	var versionCode = '';
	if (window.AdviceOwl.getVersionCode) {
		$('#versionSeparator').text('.');
		versionCode = window.AdviceOwl.getVersionCode();
	}
	$('#versionCode').text(versionCode);
}

function displayColumnEntries(name, url, image, filter) {
	$.jGFeed(url, function(feeds) {
	    // Check for errors
	    if (!feeds || feeds === undefined) {
	    	alert('Sorry - there has been an error receiving the advice column feeds.');
	    	return false;
	    }
	
	    var numEntries = 0; // because of filters, we need to keep track of how many entries actually included
		for (var j=0; j < feeds.entries.length && numEntries < NUM_ENTRIES_PER_COLUMN; j++) {
	        var entry = feeds.entries[j];
	        if (shouldIncludeEntry(entry, filter)) {
		        if ($('#adviceList li[data-entry-id="' + entry.link + '"]').length === 0) {
		        	$('#adviceList').append(buildEntryString(name, entry, image));		        	
		        }
	        	numEntries++; // count the entry if it should be included, even if we didn't append to the display
	        	//console.log('numEntries for ' + name + ': ' + numEntries);
	        }
		}
	}, // if there is a filter, increase number of entries to examine, since most entries may not qualify  
	filter === undefined ? NUM_ENTRIES_PER_COLUMN : NUM_ENTRIES_PER_COLUMN * 10);
}

function shouldIncludeEntry(entry, filter) {
	if (filter === undefined) {
		return true; // no filter - include entry by default
	}

	if (filter['category'] !== undefined) { // filtering is by category
		if (entry.categories && entry.categories.length > 0) {
			for (i = 0; i < entry.categories.length; i++) {
				//console.log('for entry', entry.title, 'checking filter', filter.category, 'vs:', entry.categories[i]);
				if (filter.category === entry.categories[i]) {
					//console.log('Found it - returning true');
					return true;
				}
			}
		}
	}

	// there was a filter, but we couldn't match it
	//console.log('Did not find a category match - returning false');
	return false;
}

function buildEntryString(name, entry, image) {
	var dateArr = entry.publishedDate.split(' ');
	var title = fixTitle(name, entry.title);
	
	return '<li data-timestamp="' + new Date(entry.publishedDate).getTime() + '" data-entry-id="' + entry.link + '">' 
	  + '<p><a href="javascript:void(0)" onclick="openLink(\'' + entry.link + '\');">' + dateArr[0] + ' ' + dateArr[2] + ' ' + dateArr[1] + ', ' + dateArr[3] + '</a></p>'
	  + '<h1>' + title + '</h1>'
	  + '<div class="adviceEntry">' + (typeof image !== 'undefined' ? '<img class="columnistImage" src="img/columnist/' + image + '" alt="' + name + ' Picture" title="' + name + '"/>' : '') 
	  + fixContent(entry.content) + '</div>'
	  + '<div class="entryFooter">'
	  + '<div class="toTop"><a href="javascript:void(0)" onclick="return scrollToTop();">^ Top</a></div>'
	  + '<div class="readLink"><a href="javascript:void(0)" onclick="openLink(\'' + entry.link + '\');">Read</a></div>'
	  + '</div>'
	  + '</li>';
}

function buildColumnNames() {
	var html = '';
	for (i = 0; i < feedList.length; i++) {
		html += feedList[i].name;
		if (i < feedList.length - 1) {
			html += ', ';
		} 
	}
	return html;
}

function fixTitle(name, title) {
	// remove the "for MM/DD/YYY" from the end of creator.com titles
	var titleMatch = title.match(/.*(\sfor\s\d\d\/\d\d\/\d\d\d\d)$/);
	if (titleMatch) { // check if the input string matched the pattern
	     title = title.substring(0, title.search(titleMatch[1])); // get the capturing group
	}

	if (name !== 'The Awl' && title.search(name) < 0) {
		title = name + ': ' + title;
	}
	
	return title;
}

function fixContent(content) {
	// remove iframe content (in Ask Amy it has messed up formatting on a small width device, while adding little value)
	var iframeRegex = new RegExp("<\s*iframe.*?\/\s*iframe\s*>", 'g');
	if (content.match(iframeRegex)) {
	    content = content.replace(iframeRegex, '');
	}

	// replace "a href" links with in app browser links 
	var linkRegex = new RegExp("(<a.*?href\s*=\s*)\"(.*?)\"(.*?>)", 'g');
	if (content.match(linkRegex)) {
	    content = content.replace(linkRegex, "$1" + '"javascript:void(0);" onclick="openLink(\'' + "$2" + '\');"' + "$3");
	}
	
	return content;
}

function openLink(link) {
	navigator.app.loadUrl(link, { openExternal: true });
	//window.plugins.childBrowser.showWebPage(link, { showLocationBar: true });
}
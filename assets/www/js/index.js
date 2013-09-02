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
        //app.receivedEvent('deviceready');
        document.addEventListener("menubutton", menuKeyDown, false);
        document.addEventListener("backbutton", backKeyDown, false);
    }
    /*
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        //alert('Received Event: ' + id);
    }*/
};

function menuKeyDown() { 
	$('#menu').slideDown('slow');
	return false;
}

function backKeyDown() {
	var hidSomething = false;
	if ($('#menu').is(':visible')) {
		$('#menu').hide();
		hidSomething = true;
	}
	if (! $('#about').hasClass('ui-selectmenu-hidden')) {
		$('#about').popup('close');
		hidSomething = true;
	}
	if (hidSomething) {
		return false; // back button was used to exit a popup, don't exit app
	}

	return exitApp();
}

function exitApp() {
	navigator.app.exitApp();
	return false;
}

var MILLISECONDS_WAIT = 5000;
var NUM_ENTRIES_PER_COLUMN = 4;
var feedList = [{name: 'Dear Prudence', url: 'http://www.slate.com/articles/life/dear_prudence.fulltext.all.10.rss', image: 'prudie.jpg'},
	            {name: 'Carolyn Hax', url: 'http://feeds.washingtonpost.com/rss/linksets/lifestyle/carolyn-hax', image: 'hax.jpg'},
	            {name: 'Savage Love', url: 'http://www.thestranger.com/gyrobase/Rss.xml?category=258', image: 'savage.jpg'},
	            {name: "Annie's Mailbox", url: 'http://www.creators.com/advice/annies-mailbox.rss', image: 'annies.jpg'},
	            {name: 'Dear Margo', url: 'http://www.creators.com/advice/dear-margo.rss', image: 'margo.jpg'},
	            {name: 'Miss Information', url: 'http://www.nerve.com/taxonomy/term/95215/all/feed', image: 'miss_information.jpg'},
	            {name: 'Questionable Advice', url: 'http://www.creators.com/advice/questionable-advice.rss', image: 'jessica_leigh.jpg'},
	            {name: 'The Advice Goddess', url: 'http://www.creators.com/advice/advice-goddess-amy-alkon.rss', image: 'amy_alkon.jpg'},
	            {name: 'Tales From The Front', url: 'http://www.creators.com/advice/tales-from-the-front.rss', image: 'cheryl_lavin.jpg'},
	            {name: 'At Work', url: 'http://www.creators.com/advice/at-work-lindsey-novak.rss', image: 'lindsey_novak.jpg'}];

function displayAbout() {
	$('#menu').hide();
	$('#about').popup('open');
	return false;
}

function refreshColumns() {
	$('#menu').hide();
	loadColumns();
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	return false;
}

function loadColumns() {
	$('#loadingImage').show('slow');
	for (i = 0; i < feedList.length; i++) {
		displayColumnEntries(feedList[i]['name'], feedList[i]['url'], feedList[i]['image']);
	}
}

function displayColumnEntries(name, url, image) {
	$.jGFeed(url, function(feeds) {
	    // Check for errors
	    if(!feeds || typeof feeds === 'undefined') {
	    	console.log('Error!');
	    	return false;
	    }
	
		for (var j=0; j<feeds.entries.length; j++) {
	        var entry = feeds.entries[j];
	        if ($('#adviceList li[data-entry-id="' + entry.link + '"]').length === 0) {
	        	$('#adviceList').append(buildEntryString(name, entry, image));
	        }
		}

		// sort 1 time(s), 5 seconds total wait
		window.setTimeout('sortElements(' + 1 + ')', MILLISECONDS_WAIT);
	}, NUM_ENTRIES_PER_COLUMN);
}


function sortElements(marker) {
	$('#adviceList li').sort(function(a, b) {
	    return a.dataset.timestamp > b.dataset.timestamp ? -1 : 1;
	}).appendTo('#adviceList');

	if (--marker < 1) {
		$('#loadingImage').fadeOut('slow');
		return;
	}
	window.setTimeout('sortElements(' + marker + ')', MILLISECONDS_WAIT);
}

function buildEntryString(name, entry, image) {
	//console.log('image:', image, ', typeof image:', typeof image);
	var dateArr = entry.publishedDate.split(' ');
	var title = entry.title;
	var titleMatch = title.match(/.*(\sfor\s\d\d\/\d\d\/\d\d\d\d)$/);
	if (titleMatch) { // check if the input string matched the pattern
	     title = title.substring(0, title.search(titleMatch[1])); // get the capturing group
	}
	return '<li data-timestamp="' + new Date(entry.publishedDate).getTime() + '" data-entry-id="' + entry.link + '">' 
	  + '<p><a href="#" onclick="window.open(\'' + entry.link + '\', \'_system\');">' + dateArr[0] + ' ' + dateArr[2] + ' ' + dateArr[1] + ', ' + dateArr[3] + '</a></p>'
	  + '<h1>' + (entry.title.search(name) >= 0 ? '' : name + ': ') + title + '</h1>'
	  + '<div class="adviceEntry">' + (typeof image !== 'undefined' ? '<img class="columnistImage" src="img/columnist/' + image + '" alt="' + name + ' Picture" title="' + name + '"/>' : '') 
	  + entry.content + '</div>'
	  + '<div class="readLink"><a href="#" onclick="window.open(\'' + entry.link + '\', \'_system\');">Read</a></div>' 
	  + '</li>';
}

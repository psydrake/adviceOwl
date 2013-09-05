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

    /* // Update DOM on a Received Event
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
	$('#menu').slideDown('fast');
	return false;
}

function backKeyDown() {
	console.log('in backKeyDown');
	var exit = true;
	if ($('#menu').is(':visible')) {
		console.log('hide main menu');
		$('#menu').hide();
		exit = false;
	}	
	if (! $('#about').hasClass('ui-selectmenu-hidden')) {
		console.log('close about menu');
		$('#about').popup('close');
	}
	if (!exit) {
		console.log('do not exit app');
		return false; // back button was used to exit a popup, don't exit app
	}

	console.log('about to exitApp');
	return exitApp();
}

function exitApp() {
	console.log('exiting app');
	navigator.app.exitApp();
	return true;
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
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	window.setTimeout(function () {$('#about').popup('open', {positionTo: '#top'});}, 800);
	$('#menu').slideUp('fast');		
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

function loadAboutColumnNames() {
	$('#aboutList').append('<li><strong>Columns:</strong> ' + buildColumnNames() + '</li>');
}

function displayColumnEntries(name, url, image) {
	$.jGFeed(url, function(feeds) {
	    // Check for errors
	    if(!feeds || typeof feeds === 'undefined') {
	    	alert('Sorry - there has been an error receiving the advice column feeds.');
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
	var dateArr = entry.publishedDate.split(' ');
	var title = entry.title;
	// remove the "for MM/DD/YYY" from the end of creator.com titles
	var titleMatch = title.match(/.*(\sfor\s\d\d\/\d\d\/\d\d\d\d)$/);
	if (titleMatch) { // check if the input string matched the pattern
	     title = title.substring(0, title.search(titleMatch[1])); // get the capturing group
	}
	return '<li data-timestamp="' + new Date(entry.publishedDate).getTime() + '" data-entry-id="' + entry.link + '">' 
	  + '<p><a href="javascript:void(0)" onclick="openLink(\'' + entry.link + '\');">' + dateArr[0] + ' ' + dateArr[2] + ' ' + dateArr[1] + ', ' + dateArr[3] + '</a></p>'
	  + '<h1>' + (entry.title.search(name) >= 0 ? '' : name + ': ') + title + '</h1>'
	  + '<div class="adviceEntry">' + (typeof image !== 'undefined' ? '<img class="columnistImage" src="img/columnist/' + image + '" alt="' + name + ' Picture" title="' + name + '"/>' : '') 
	  + fixContent(entry.content) + '</div>'
	  + '<div class="readLink"><a href="javascript:void(0)" onclick="openLink(\'' + entry.link + '\');">Read</a></div>' 
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

function fixContent(content) {
	// replace "a href" links with in app browser links 
	var regex = new RegExp("(<a.*?href\s*=\s*)\"(.*?)\"(.*?>)", 'g');
	if (content.match(regex)) {
	    content = content.replace(regex, "$1" + '"javascript:void(0);" onclick="openLink(\'' + "$2" + '\');"' + "$3");
	}
	return content;
}

function openLink(link) {
	navigator.app.loadUrl(link, { openExternal: true });
	//window.plugins.childBrowser.showWebPage(link, { showLocationBar: true });
}
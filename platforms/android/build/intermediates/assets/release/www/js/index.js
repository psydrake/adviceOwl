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

var DEFAULT_VERSION_NAME = '1.8';
var MILLISECONDS_BETWEEN_REFRESH = 1000 * 60 * 60; // do a content refresh if it's been 1 hour since the last cache update
var MAX_NUM_ENTRIES = 40;

function displayAbout() {
	$('#menu').hide();
	$.mobile.changePage("#aboutDialog");
	return false;
}

function scrollToTop() {
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	return false;
}

function onclickRefreshButton() {
	$('#refreshImage').attr('src', 'css/images/ajax-loader.gif');
	return refreshColumns();
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
		downloadAndDisplayEntries().then(
			function(columnNamesList) {
				if (columnNamesList && columnNamesList.length) {
					if ($('#aboutColumnNames').length < 1) { // add column names element in About modal, only if it isn't already there
						$('#aboutList').append('<li id="aboutColumnNames"><strong>Columns:</strong> ' + buildColumnNames(columnNamesList) + '</li>');
					}
					sortElements();
					endLoadingMoments();
					window.setTimeout('cleanupOldColumnEntries()', 1000);
					window.setTimeout('saveColumnEntriesToCache()', 2000);
				}
			},
			function(error) {
				console.log("Error downloading and displaying entries.", error);
				endLoadingMoments();				
			}
		);
	}
	else {
		endLoadingMoments();
	}
}

function endLoadingMoments() {
	$('#refreshImage').attr('src', 'img/refresh.png');
	$('#ajax-loader').fadeOut('slow');
}

function sortElements() {
	$('#adviceList li').sort(function(a, b) {
	    //return a.dataset.timestamp > b.dataset.timestamp ? -1 : 1;
	    return a.getAttribute('data-timestamp') > b.getAttribute('data-timestamp') ? -1 : 1;
	}).appendTo('#adviceList');
}

function cleanupOldColumnEntries() {
	$("#adviceList li").each(function(index) {
		  if (index > MAX_NUM_ENTRIES) {
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
		}
	}
}

function loadAbout() {	
	var versionName = DEFAULT_VERSION_NAME;
	if (window.AdviceOwl && window.AdviceOwl.getVersionName) {
		versionName = window.AdviceOwl.getVersionName();
	}
	$('#versionName').text(versionName);
	
	var versionCode = '';
	if (window.AdviceOwl && window.AdviceOwl.getVersionCode) {
		$('#versionSeparator').text('.');
		versionCode = window.AdviceOwl.getVersionCode();
	}
	$('#versionCode').text(versionCode);
}

// returns list of unique column names (e.g. Dear Prudence) added from entries.xml in adviceowl s3 bucket
function downloadAndDisplayEntries() {
	/*var request = new XMLHttpRequest();
	request.open("GET", "https://s3-us-west-2.amazonaws.com/adviceowlfeed/entries.xml", false);
	request.send();
	var xml = request.responseXML;*/

	var deferred = new $.Deferred();
	$.ajax({
		type: 'GET',
		url: 'https://s3-us-west-2.amazonaws.com/adviceowlfeed/entries.xml',
		success: function(resp) {
			var entries = resp.getElementsByTagName("entry");

			var columnNames = [];
			for (var i = 0; i < entries.length; i++) {
			    var entry = entries[i];
			    var name = entry.getElementsByTagName("name")[0].innerHTML;
				if (columnNames.indexOf(name) < 0) {
					columnNames.push(name);
				}
				var image = entry.getElementsByTagName("image")[0].innerHTML;
			    var link = entry.getElementsByTagName("link")[0].innerHTML;
				var pubDate = entry.getElementsByTagName("pubDate")[0].innerHTML;
			    var title = entry.getElementsByTagName("title")[0].textContent;
				var description = entry.getElementsByTagName("description")[0].textContent;
		
				var entryJson = {title: title, publishedDate: pubDate, link: link, content: description};		
		        if ($('#adviceList li[data-entry-id="' + entryJson.link + '"]').length === 0) { // if entry isn't already included
		        	$('#adviceList').append(buildEntryString(name, entryJson, image));		        	
		        }
			}
			deferred.resolve(columnNames);
		},
		error: function(err) {
			console.log("Error!", err);
			deferred.reject(err);
		}
	});

	return deferred.promise();
}

// this output appended to the document
function buildEntryString(name, entry, image) {
	var dateArr = entry.publishedDate.split(' ');
	var title = fixTitle(name, entry.title);
	
	return '<li data-timestamp="' + new Date(entry.publishedDate).getTime() + '" data-entry-id="' + entry.link + '">' 
	  + '<p><a href="javascript:void(0)" onclick="openLink(\'' + entry.link + '\')">' + dateArr[0] + ' ' + dateArr[2] + ' ' + dateArr[1] + ', ' + dateArr[3] + '</a>'
	  + '<a href="javascript:void(0)" onclick="expandEntry(\'' + entry.link + '\')" class="expandIcon expandCollapseIcon" style="display:none"><i class="fa fa-plus-square-o"></i></a>' 
	  + '<a href="javascript:void(0)" onclick="collapseEntry(\'' + entry.link + '\')" class="collapseIcon expandCollapseIcon"><i class="fa fa-minus-square-o"></i></a>' 
	  + '</p><h1>' + title + '</h1>'
	  + '<div class="adviceEntry"><img class="columnistImage" src="' + image + '" alt="' + name + '" title="' + name + '"/>'
	  + fixContent(entry.content) + '</div>'
	  + '<div class="entryFooter">'
	  + '<div class="toTop"><a href="javascript:void(0)" onclick="return scrollToTop();">^ Top</a></div>'
	  + '<div class="readLink"><a href="javascript:void(0)" onclick="openLink(\'' + entry.link + '\');">Read</a></div>'
	  + '</div>'
	  + '</li>';
}

function expandEntry(link) {
	$('#adviceList li[data-entry-id="' + link + '"] a.expandIcon').hide();
	$('#adviceList li[data-entry-id="' + link + '"] .adviceEntry').slideDown('slow');
	$('#adviceList li[data-entry-id="' + link + '"] a.collapseIcon').show();
}

function collapseEntry(link) {
	$('#adviceList li[data-entry-id="' + link + '"] a.collapseIcon').hide();
	$('#adviceList li[data-entry-id="' + link + '"] .adviceEntry').slideUp('slow');
	$('#adviceList li[data-entry-id="' + link + '"] a.expandIcon').show();
}

function buildColumnNames(columnNamesList) {
	var html = '';
	for (i = 0; columnNamesList && i < columnNamesList.length; i++) {
		html += columnNamesList[i];
		if (i < columnNamesList.length - 1) {
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

	// add break after image in Ask Polly articles
    var askPollyPicRegex = new RegExp("(<img.*?theawl\.com.*?>.*?)(<b>Dear Polly,</b>)");
    if (content.match(askPollyPicRegex)) {
        content = content.replace(askPollyPicRegex, "$1" + '<br/><br/>' + "$2");
    }
	
	return content;
}

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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function displayArticles() {
	var feeds = [{name: 'Dear Prudence', url: 'http://www.slate.com/articles/life/dear_prudence.fulltext.all.10.rss', followLink: false},
	            {name: 'Carolyn Hax', url: 'http://feeds.washingtonpost.com/rss/linksets/lifestyle/carolyn-hax', followLink: true},
	            {name: 'Savage Love', url: 'http://www.thestranger.com/gyrobase/Rss.xml?category=258', followLink: false},
	            {name: "Annie's Mailbox", url: 'http://www.creators.com/advice/annies-mailbox.rss', followLink: true},
	            {name: 'Dear Margo', url: 'http://www.creators.com/advice/dear-margo.rss', followLink: true},
	            {name: 'Miss Information', url: 'http://www.nerve.com/taxonomy/term/95215/all/feed', followLink: true}];
	
	for (i = 0; i < feeds.length; i++) {
		displayEntries(feeds[i]['name'], feeds[i]['url'], feeds[i]['followLink']);
	}
    //entries.sort(function(a,b){return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()});
}

function displayEntries(name, url, followLink) {
	$.jGFeed(url, 
			function(feeds) {
			    // Check for errors
			    if(!feeds){
			      console.log('Error!');
			      return false;
			    }
			    for (var i=0; i<feeds.entries.length; i++) {
	                var entry = feeds.entries[i];
	                var entryTs = new Date(entry.publishedDate).getTime();
	                if ($('li[data-timestamp]').length === 0) {
				        $('#adviceList').append(buildEntryString(name, entry));
	                }
	                else {
		                $('li[data-timestamp]').each(function(index) {
		                	var compTs = $(this).attr('data-timestamp');
		                	console.log('entryTs: ', entryTs, ', compTs: ', compTs, ' entryTs > compTs: ', entryTs > compTs);
		                	if (entryTs > compTs) {
		    			        $(this).before(buildEntryString(name, entry));
	   					    }
		                	else {
		    			        $(this).after(buildEntryString(name, entry));
		                	}
		                	return false;
	                	});
	                }
			    }
	}, 10);
}

function buildEntryString(name, entry) {
	return '<li data-timestamp="' + new Date(entry.publishedDate).getTime() + '">' + entry.publishedDate
	  + '<h1>' + (entry.title.search(name) >= 0 ? '' : name + ': ') + entry.title + '</h1>'
	  + '<p>' + entry.content + '</p>'
	  + '</li>';
}

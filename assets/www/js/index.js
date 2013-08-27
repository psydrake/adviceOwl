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
	var urls = ['http://www.slate.com/articles/life/dear_prudence.fulltext.all.10.rss',
	            'http://feeds.washingtonpost.com/rss/linksets/lifestyle/carolyn-hax',
	            'http://www.rsssearchhub.com/preview/the-stranger-seattle-s-only-newspaper-savage-love-rss-rDDDJKd/',
	            'http://www.creators.com/advice/annies-mailbox.rss',
	            'http://www.creators.com/advice/dear-margo.rss',
	            'http://www.nerve.com/taxonomy/term/95215/all/feed',
	            'http://sentinelenterprise.disqus.com/y_reaches_out_isolated_niece/latest.rss'];
	
	for (i = 0; i < urls.length; i++) {
		displayArticle(urls[i]);
	}
}

function displayArticle(url) {
$.jGFeed(url,
		  function(feeds){
		    // Check for errors
		    if(!feeds){
		      // there was an error
		      alert('Error!');
		      return false;
		    }
		    // do whatever you want with feeds here
		    for (var i=0; i<feeds.entries.length; i++){
		      var entry = feeds.entries[i];
	          $('#adviceList').append('<li>' 
	        		  + '<h1>' + entry.title + '</h1>'
	        		  + '<p>' + entry.content + '</p>'
	        		  + '</li>');
		      //feed.push(entry);
		      //alert(entry.title);
		    }
		  }, 10);
}
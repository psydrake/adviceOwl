// Use in-app browser
function openLink(link) {
	if (link && link.match(/^mailto:/)) {
		window.open(encodeURI(link)); 
	}
	else {
		window.open(encodeURI(link), '_blank', 'location=yes'); 
	}
}

// initialize admob banner and google analytics
function doCustomActions() {
	//createBannerView();
	initializeUniversalAnalytics();
}

// custom functions for iOS
function createBannerView() {
	var am = window.plugins.AdMob;
    am.createBannerView( 
		{
			'publisherId': 'ca-app-pub-8928397865273246/5218817813',
			'adSize': am.AD_SIZE.BANNER,
			'bannerAtTop': false
		}, function() {
			requestAd();
		}, function(){
			// fail quietly
		});
}

function requestAd() {
	window.plugins.AdMob.requestAd(
	     {
			'isTesting': false,
			'extras': {
				'color_bg': 'FFFFFF',
				'color_bg_top': 'FFFFFF',
				'color_border': 'FFFFFF',
				'color_link': '000080',
				'color_text': '808080',
				'color_url': '008000'
			},
	     },
		function() {
			showAd();
		},
   		function () { 
			// fail quietly
		}
	 );
}

function showAd() {
	window.plugins.AdMob.showAd( 
		true, // or false
		function() {
			// yay
		},
	    function() {
			// fail quietly
		}
	 );
}

function initializeUniversalAnalytics() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-45095317-2', 'auto');
    ga('send', 'pageview');
    /*
    $.ajax({
       type: "POST",
       //contentType: "application/x-www-form-urlencoded",
       url:  'http://www.google-analytics.com',
       data: { v: 1,                 // Version.
	       tid: 'UA-45095317-2', // Tracking ID
	       cid: getGUID(),       // Anonymous Client ID
	       t: 'appview',         // Appview hit type
	       an: 'adviceOwl',      // App name
	       av: '1.4.24',         // App version
	       cd: 'home'            // Screen name / content description
	     },
       success: function(data) {
            console.log("success ", data.response);
        },
        error: function(data) {
            console.log("error ", data.error);
        }
    });
    */
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function getNewGUID() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function getGUID() {
    var guid = '555';
    if (store) { // Get and use any cached content. Set forceRefresh to true if enough time has passed
	guid = store.get('guid');
	console.log('GUID from store:', guid);
    }
    if (!guid) {
	guid = getNewGUID();
	console.log('created new GUID:', guid);
	if (store) {
	    store.set('guid', guid);
	    console.log('stored GUID');
	}
    }
    return guid;
}

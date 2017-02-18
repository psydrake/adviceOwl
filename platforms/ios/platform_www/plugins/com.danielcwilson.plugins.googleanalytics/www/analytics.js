cordova.define("com.danielcwilson.plugins.googleanalytics.UniversalAnalytics", function(require, exports, module) { function UniversalAnalyticsPlugin() {};

UniversalAnalyticsPlugin.prototype.startTrackerWithId = function(id) {
	cordova.exec(function() {}, function() {}, 'UniversalAnalytics', 'startTrackerWithId', [id]);
};

UniversalAnalyticsPlugin.prototype.trackView = function(screen) {
	cordova.exec(function() {}, function() {}, 'UniversalAnalytics', 'trackView', [screen]);
};

UniversalAnalyticsPlugin.prototype.trackEvent = function(category, action, label) {
	cordova.exec(function() {}, function() {}, 'UniversalAnalytics', 'trackEvent', [category, action, label]);
};

module.exports = new UniversalAnalyticsPlugin();

});

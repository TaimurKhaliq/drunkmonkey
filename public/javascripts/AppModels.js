var tweet = Backbone.Model.extend({
	defaults : {
		tweet : ''
	}
});

var tweetCollection = Backbone.Collection.extend({
	model: tweet
});
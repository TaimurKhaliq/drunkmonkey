var tweetStream = Backbone.View.extend({

	tagName: "li",
	className: "tweetStream",
	
	initialize: function ()
	{
		console.log(this.model);
		this.model.bind("add", this.render);
	},
	
	render: function ()
	{
		var html = '';
		var template = _.template($('#tweetTemplate').html());
		
		for (var i=1; i<this.models.length; i = i + 1)
		{
			var model = this.models[i];
			var tweet = model.get("tweet");
			var text = tweet.text;
			
			html += template({
				data: text
			});
		}
		$("#streamChat").html(html);
	}
});

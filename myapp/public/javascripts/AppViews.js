var tweetStream = Backbone.View.extend({

	tagName: "li",
	className: "tweetStream",
	
	initialize: function ()
	{
		console.log(this.model);
		this.model.bind("add", this.render);
	},
	
	renderTest: function ()
	{
	   console.log("ADDING NEW MODEL!");
	   console.log(this.models);
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
		console.log(html);
		$("#streamChat").html(html);
	}
});

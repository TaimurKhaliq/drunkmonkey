window.tw =
{	
	reload: null,
	socket : io.connect('http://deep-light-2010.herokuapp.com/')
};

(function ()
{
	var AppController = Backbone.Router.extend(
	{
		routes: 
		{
			
		},
		
		start : function ()
		{
			var tweetCol = new tweetCollection();
			var tweetView = new tweetStream({ model: tweetCol });
			
			window.tw.socket.on("searchResult", function (data)
			{
				var tweetModel = new tweet( { tweet: data });
				tweetCol.add(tweetModel);
			});
			
			$(".magic").bind('keypress', function(e) 
			{
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code === 13) 
				{
					// i am going to send this keyword to the server uhmm this is really not 
					// using backbone.js but whatever ill refactor it in the future
					var searchItem = $(".magic").val();
					window.tw.socket.emit("tweetSearch", searchItem); 
				}
			});		
		}		
	});
	
	//
	// The single instance of the app controller
	//
	
	tw.app = new AppController();
		
})();


$(function ()
{
	//
	// Start the app controller
	//
    tw.app.start(); 
});


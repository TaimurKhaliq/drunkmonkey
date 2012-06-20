window.tw =
{	
	reload: null,
	socket : io.connect('http://localhost:3000')
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
			window.tw.socket.on('news', function (data) {
			    console.log(data);
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


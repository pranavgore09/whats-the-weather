// A model that will hold parsed JSON output from "http://api.openweathermap.org/"
		var City = Backbone.Model.extend({
			initialize : function(){
				console.log("initializing the city model...");
			},
			defaults:{
				// name of the city
				name : 'not set yet',
				// array of objects on each date as a key
				// object will contain another array of objects on time as a key
				date : []
			}
		});
		// A view that renders "userInputTemplate"
		// listens to click event of button
		// On click, get list of stinrgs, break it down and fetch weather accordingly
		var UserInputView = Backbone.View.extend({
			initialize:function(){
				console.log("initializing userInputView...");
				this.render();
			},
			render: function(){
				var template = _.template($("#userInputTemplate").html(),{});
				this.$el.html(template);
			},
			events:{
				"click input[type=button]" : "fetchUserInput"
			},
			fetchUserInput : function(event){
				var rawCityList = this.$el.find("#cityList").val();
				var cities = rawCityList.split(",");
				var totalRecords = cities.length-1;
				for(var i=0;i<cities.length;i++){
					var isPresent = multipleCitiesObject.findWhere({name:cities[i].toLowerCase()});
					if(typeof isPresent === "object"){
						alert(cities[i] +  " is already on the display.");
						continue;
					}
					getWeather(cities[i].trim(),i,totalRecords);
				}
			}
		});
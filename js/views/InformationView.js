		

		// A view that listens to the "MultipleCities" collection
		// on adding the model to "MultipleCities", this view will take that new model
		// and it will display first found record with its weather description
		// It renders "tableCellTemplete"
		// On completion, fade out the loader
		var InformationView = Backbone.View.extend({
			el : "#mainDivForCityWeather",
			initialize:function(){
				console.log("initializing InformationView...");
				this.listenTo(this.collection, "add", this.showAdded);
				this.listenTo(this.collection, "allDone", this.allDone);
			},
			showAdded : function(newModel){
				console.log("I will display the latest one right now");
				var cityName = newModel.get('name');
				newModel = newModel.get('date');
				$("#cities").append("<td>"+cityName+"</td>");
				console.log(newModel);
				var key = "";
				var templateForModelFirstEntry = "";
				for(key in newModel){
					for(timeKey in newModel[key]){
						templateForModelFirstEntry =_.template($("#tableCellTemplete").html(),{timer:timeKey, 
													description:newModel[key][timeKey].description,
													cityName:cityName,
													key : key
													});
						$("#"+key).append(templateForModelFirstEntry);
						break;
					}
				}
			},
			allDone : function(){
				console.log("and you are here");
				$("#loader").fadeOut(500);
			}
		});
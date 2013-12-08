		

		// Function to fade IN and OUT the modal view
		// this also renders "tagLineTemplate" and "singleDayRow"
		// finally appends the contents to "singleDayWeather"
		function showModal(cityName,key){
			var result = multipleCitiesObject.findWhere({name:''+cityName});
			if(typeof result === "object"){
				$("#modal-view").fadeIn("slow");
				var requestDateContent = result.get('date')[key];
				console.log(requestDateContent);
				var timeKey = "";
				var singleRowTemplate = "";
				var tokens = key.split("_");
				var displayDate = tokens[0] + " " + months[tokens[1]] + " " + tokens[2];
				var tagLineTemplate = _.template($("#tagLineTemplate").html(),{cityName:cityName,displayDate:displayDate});
				$("#tagLine").append(tagLineTemplate);
				for(timeKey in requestDateContent){
					singleRowTemplate = _.template($("#singleDayRow").html(),{
															time : timeKey,
															pressure:	requestDateContent[timeKey].pressure,
															humidity:	requestDateContent[timeKey].humidity,
															sea_level:	requestDateContent[timeKey].sea_level,
															temperature:	requestDateContent[timeKey].temp
															});
					$("#singleDayWeather").append(singleRowTemplate);
				}				
				// console.log(multipleCitiesObject[result]);
			}else{
				closeModal();
				alert("Something went wrong, please try again !");
			}
			
		}

		// first clean it and then fade out
		function closeModal(){
			cleanModal();
			$("#modal-view").fadeOut(500);
		}

		// keep bootstrap information as it is required for next request
		// clean other modal contents
		function cleanModal(){
			$("#singleDayWeather").html('<tr><th>Time</th><th>Pressure</th><th>Humidity</th><th>Temperature</th><th>sea_level</th></tr>');
			$("#tagLine").html('');
		}


		// Ajax call to fetch city weather
		// calculates "start" amd "end" for the request
		// GET request to "http://api.openweathermap.org/" with cityname, APPID, start unixtimestamp, end unixtimestamp
		// on success parse all JSON data for that city
		// on failure inform the user about failure.
		var getWeather = function(cityName, currentRecord, totalRecords){
			$("#loader").fadeIn("slow");
						
			var end = new Date();
			end = end.getTime();
			
			var start = new Date(end - (24*60*60*30*1000));
			start = start.getTime();
			
			end = Math.floor(end/1000);

			start = Math.floor(start/1000);

			Backbone.ajax({
				dataType : "jsonp",
				type: "GET",
				url :"http://api.openweathermap.org/data/2.5/history/city?",
				data:{
					q:cityName,
					APPID:"88cb738625944c32ee3c934519c",
					start: start,
					end: end
				},
				success: function(val){
					console.log(val);
					// check val.cnt and then proceed.
					if(val.cnt > 0){
						
						var index = 0;
						var dateStr = "";
						var hoursMinutes = "";
						var date = [];
						var cityName = (val.list[0].city.name).toLowerCase();
						var isPresent = multipleCitiesObject.findWhere({name:cityName});
						if(typeof isPresent === "object"){
							alert(cityName +  " is already on the display.");
							return;
						}					
						for(index in val.list){
							tempDate = new Date(val.list[index].dt*1000);
							dateStr = tempDate.getDate() + "_" + tempDate.getMonth() + "_" + tempDate.getFullYear();
							hoursMinutes = tempDate.getHours() + ":" + tempDate.getMinutes();
							if(dateStr in date){
							}
							else{
								date[dateStr] = [];
							}							
							date[dateStr][hoursMinutes] = {};
							date[dateStr][hoursMinutes].humidity = val.list[index].main['humidity'];
							date[dateStr][hoursMinutes].pressure = val.list[index].main['pressure'];
							date[dateStr][hoursMinutes].temp = val.list[index].main['temp'];
							date[dateStr][hoursMinutes].sea_level = val.list[index].main['sea_level'];
							date[dateStr][hoursMinutes].description = val.list[index].weather[0].description;
							date[dateStr][hoursMinutes].cityId = val.city_id;
							date[dateStr][hoursMinutes].main = val.list[index].weather[0].main;
							date[dateStr][hoursMinutes].name = val.list[index].city.name;
						}
						var newCity = new City();
						newCity.set('name',cityName);
						newCity.set('date',date);
						multipleCitiesObject.add(newCity);
					}else{
						console.log("No records found");
						alert("No records found for the request ");
					}
					if(currentRecord == totalRecords)
						multipleCitiesObject.trigger("allDone");
				},
				error: function(error){
					alert("unable to process the request : " + cityName);
					multipleCitiesObject.trigger("allDone");
				}
			});
		};
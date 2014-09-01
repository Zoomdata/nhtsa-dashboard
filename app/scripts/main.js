
var apiKey = '53e569eae4b0a9e9da986978',
    host = 'daily.zoomdata.com/zoomdata',
    secure = true,
    sourceName = "Vehicle Complaints",
    lifted = false,
    makeVis, modelVis, trendVis, countTextVis, complaintsGaugeVis,
    injuriesGaugeVis, deathsGaugeVis, scatterplotVis;

var $makeBarChart = $("#make-bar-chart"),
	$modelBarChart = $("#model-bar-chart"),
	$trendVis = $("#trend"),
	$totalCountText = $("#total-count-text"),
	$complaintsGauge = $("#complaints-gauge"),
	$injuriesGauge = $("#injuries-gauge"),
	$deathsGauge = $("#deaths-gauge"),
	$scatterplot = $("#scatterplot")
	$overlay = $(".overlay");

$(document).ready(function() {
	$('button.reset').on('mousedown', function() {
    	var active = $modelBarChart.find('div.active');
    	active.toggleClass('active', false);

	    var filter = {
	        path: 'model'
	    };

	    modelVis.controller.state.removeFilter(filter);
	    countTextVis.controller.state.removeFilter(filter);
	    complaintsGaugeVis.controller.state.removeFilter(filter);
	    injuriesGaugeVis.controller.state.removeFilter(filter);
	    deathsGaugeVis.controller.state.removeFilter(filter);
	    scatterplotVis.controller.state.removeFilter(filter);
	});

	$('button.show-data').on('mousedown', function() {
		var liftDuration = 2000;
		if(!lifted) {
			$(".dashboard-foreground").velocity({
				rotateX: 90
			}, "easeOutBack", liftDuration);

			$.Velocity.hook($(".dashboard-foreground"), "transformOrigin", "0px 0px");
			$.Velocity.hook($(".dashboard-foreground"), "perspectiveOrigin", "0px 0px");
			lifted = true;
		} else {
			$(".dashboard-foreground").velocity({ 
				rotateX: 0
			}, "easeOutExpo", liftDuration);

			$.Velocity.hook($(".dashboard-foreground"), "transformOrigin", "0px 0px");
			lifted = false;
		}
	});

	//hideOverlay();
});

function hideOverlay() {
	$overlay.velocity({ opacity: 0 }, { display: "none" });
	$(".overlay-description").velocity({ opacity: 0 }, { display: "none" });
	$(".overlay-instructions").velocity({ opacity: 0 }, { display: "none" });
}

var zoomdataClient = new ZoomdataClient({
    apiKey: apiKey,
    host: host,
    secure: secure
});

zoomdataClient.visualize({
    visualization: "Horizontal Bars by Make",
    source: sourceName,
    element: $makeBarChart.get(0)
}).done(function(visualization) {
	makeVis = visualization;

    visualization
        .controller
        .elementsManager
        .on('interaction', function (interactiveElement) {
        	if($overlay.is(":visible")) {
        		hideOverlay();
        	}

        	var active = $makeBarChart.find('div.active');
        	active.toggleClass('active', false);

            interactiveElement.$el.toggleClass('active');

            var carMake = interactiveElement.data().group;

		    var filter = {
		        operation: 'IN',
		        path: 'make',
		        value: [carMake]
		    };

		    modelVis.controller.state.setFilter(filter);
		    countTextVis.controller.state.setFilter(filter);
		    complaintsGaugeVis.controller.state.setFilter(filter);
		    injuriesGaugeVis.controller.state.setFilter(filter);
		    deathsGaugeVis.controller.state.setFilter(filter);
	    	scatterplotVis.controller.state.setFilter(filter);
        });
});

zoomdataClient.visualize({
    visualization: "Horizontal Bars by Model",
    source: sourceName,
    element: $modelBarChart.get(0)
}).done(function(visualization) {
	modelVis = visualization;

    visualization
        .controller
        .elementsManager
        .on('interaction', function (interactiveElement) {
        	var active = $modelBarChart.find('div.active');
        	active.toggleClass('active', false);
        	
            interactiveElement.$el.toggleClass('active');

            var carModel = interactiveElement.data().group;

		    var filter = {
		        operation: 'IN',
		        path: 'model',
		        value: [carModel]
		    };

		    countTextVis.controller.state.setFilter(filter);
		    complaintsGaugeVis.controller.state.setFilter(filter);
		    injuriesGaugeVis.controller.state.setFilter(filter);
		    deathsGaugeVis.controller.state.setFilter(filter);
		    scatterplotVis.controller.state.setFilter(filter);
        });
});

// zoomdataClient.visualize({
//     visualization: "Brushing Year Chart",
//     source: sourceName,
//     element: $trendVis.get(0)
// }).done(function(visualization) {
// 	trendVis = visualization;
// });

zoomdataClient.visualize({
    visualization: "Total Count Text",
    source: sourceName,
    element: $totalCountText.get(0)
}).done(function(visualization) {
	countTextVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Complaints Gauge",
    source: sourceName,
    element: $complaintsGauge.get(0)
}).done(function(visualization) {
	complaintsGaugeVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Injuries Gauge",
    source: sourceName,
    element: $injuriesGauge.get(0)
}).done(function(visualization) {
	injuriesGaugeVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Deaths Gauge",
    source: sourceName,
    element: $deathsGauge.get(0)
}).done(function(visualization) {
	deathsGaugeVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Complaints Scatterplot",
    source: sourceName,
    element: $scatterplot.get(0)
}).done(function(visualization) {
	scatterplotVis = visualization;
});

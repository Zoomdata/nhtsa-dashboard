
var apiKey = '53e569eae4b0a9e9da986978',
    host = 'daily.zoomdata.com/zoomdata',
    secure = true,
    sourceName = "Vehicle Complaints",
    lifted = false,
    hasNextDetails = true,
    loadingDetails = false,
    detailsOffset = 0,
    makeVis, modelVis, trendVis, countTextVis, complaintsGaugeVis,
    injuriesGaugeVis, deathsGaugeVis, deathsGauge2Vis, scatterplotVis;

var $makeBarChart = $("#make-bar-chart"),
	$modelBarChart = $("#model-bar-chart"),
	$trendVis = $("#trend"),
	$totalCountText = $("#total-count-text"),
	$complaintsGauge = $("#complaints-gauge"),
	$injuriesGauge = $("#injuries-gauge"),
	$deathsGauge = $("#deaths-gauge"),
	$deathsGauge2 = $("#deaths-gauge2"),
	$scatterplot = $("#scatterplot")
	$overlay = $(".overlay"),
	$backgridContainer = $(".backgrid-container");



var Record = Backbone.Model.extend({});

var Records = Backbone.Collection.extend({
  model: Record
});

var records = new Records();

var columns = [
{
	name: "make",
    label: "MAKE",
    editable: false,
    cell: "string"
  }, {
    name: "model",
    label: "MODEL",
    editable: false,
    cell: "string"
  }, {
    name: "year",
    label: "YEAR",
    editable: false,
    cell: "string"
  }, {
    name: "crashed",
    label: "CRASHED",
    editable: false,
    cell: "string"
  }, {
    name: "fire",
    label: "FIRE",
    editable: false,
    cell: "string"
  }, {
    name: "injured",
    label: "INJURED",
    editable: false,
    cell: "string"
  }, {
    name: "description",
    label: "FAILED COMPONENT",
    editable: false,
    cell: "string"
}, {
    name: "state",
    label: "STATE",
    editable: false,
    cell: "string"
  }, {
    name: "city",
    label: "CITY",
    editable: false,
    cell: "string"
  }];

// Initialize a new Grid instance
var grid = new Backgrid.Grid({
  columns: columns,
  collection: records
});

// Render the grid and attach the root to your HTML document
$backgridContainer.append(grid.render().el);

$backgridContainer.scroll(function() {
    if( this.scrollHeight - $backgridContainer.height() - this.scrollTop < 100 && hasNextDetails && !loadingDetails){
        getDetails();
    }
});

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
	    deathsGauge2Vis.controller.state.removeFilter(filter);
	    scatterplotVis.controller.state.removeFilter(filter);
	});

	$('button.show-data').on('mousedown', function() {
		var liftDuration = 2000;
		if(!lifted) {
	        detailsOffset = 0;
	        hasNextDetails = true;
			getDetails();

			$(".dashboard-foreground").velocity({
				rotateX: 90
			}, "easeOutBack", liftDuration);

			var currentCount = $("#total-count-text").text();
			$("#dashboard-background-total").text(numberWithCommas(currentCount));

			$.Velocity.hook($(".dashboard-foreground"), "transformOrigin", "0px 0px");
			$.Velocity.hook($(".dashboard-foreground"), "perspectiveOrigin", "0px 0px");

			lifted = true;
		} else {
			$(".dashboard-foreground").velocity({ 
				rotateX: 0
			}, {
				duration: liftDuration,
				complete: function() {
					records.reset();
				}
			});

			$.Velocity.hook($(".dashboard-foreground"), "transformOrigin", "0px 0px");
			lifted = false;
		}
	});

	// hideOverlay();
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
		    deathsGauge2Vis.controller.state.setFilter(filter);
	    	scatterplotVis.controller.state.setFilter(filter);
        });

    setTimeout(function() {
    	zoomdataClient.visualize({
		    visualization: "Brushing Year Chart",
		    source: sourceName,
		    element: $trendVis.get(0)
		}).done(function(visualization) {
			trendVis = visualization;

			Zoomdata.eventDispatcher.on('filter:years', function(years) {
				if(years.length > 0) {
				    var filter = {
				        operation: 'IN',
				        path: 'year',
				        value: years
				    };

				    countTextVis.controller.state.setFilter(filter);
				    complaintsGaugeVis.controller.state.setFilter(filter);
				    injuriesGaugeVis.controller.state.setFilter(filter);
				    deathsGaugeVis.controller.state.setFilter(filter);
				    deathsGauge2Vis.controller.state.setFilter(filter);
				    scatterplotVis.controller.state.setFilter(filter);
				} else {
				    var filter = {
				        path: 'year'
				    };

				    countTextVis.controller.state.removeFilter(filter);
				    complaintsGaugeVis.controller.state.removeFilter(filter);
				    injuriesGaugeVis.controller.state.removeFilter(filter);
				    deathsGaugeVis.controller.state.removeFilter(filter);
				    deathsGauge2Vis.controller.state.removeFilter(filter);
				    scatterplotVis.controller.state.removeFilter(filter);
				}
			});
		});
    }, 1000);
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
		    deathsGauge2Vis.controller.state.setFilter(filter);
		    scatterplotVis.controller.state.setFilter(filter);
        });
});

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
    visualization: "Vehicle Deaths Gauge",
    source: sourceName,
    element: $deathsGauge2.get(0)
}).done(function(visualization) {
	deathsGauge2Vis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Complaints Scatterplot",
    source: sourceName,
    element: $scatterplot.get(0)
}).done(function(visualization) {
	scatterplotVis = visualization;
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function makePreviewEndpointURL() {
    var endpointURL = secure ? 'https://' : 'http://';
    endpointURL += host + '/service/stream/preview';
    endpointURL += '?key=' + apiKey;

    return endpointURL;
}

function getDetails() {
    loadingDetails = true;
    var filters = countTextVis.controller.state.filters.toJSON();
    filters.forEach(function(filter) {
    	delete filter.editable;
    	filter.value = filter.value[0];
    	filter.operation = "EQUALS";
    });

    var streamSourceId = makeVis.controller.state.get('streamSourceId'),
        url = makePreviewEndpointURL(),
        count = 50,
        payload = {
            count: count,
            offset: detailsOffset,
            fromTime: 788947200000,
            toTime: 1404975600000,
            restrictions: filters,
            streamSourceId: streamSourceId,
            timestampField: 'failtimestamp_real'
        };

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(payload),
        contentType: 'application/json'
    })
    .done(function (message) {
        hasNextDetails = message.hasNext;

        records.add(message.documents);

        detailsOffset += count;
        loadingDetails = false;
    })
    .fail(function (response) {
        console.log('ERROR: ', response);
        loadingDetails = false;
    });
}

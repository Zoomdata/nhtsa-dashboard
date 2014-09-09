
var apiKey = '53e569eae4b0a9e9da986978',
    host = 'daily.zoomdata.com/zoomdata',
    secure = true,
    sourceName = "Vehicle Complaints",
    lifted = false,
    hasNextDetails = true,
    loadingDetails = false,
    detailsOffset = 0,
    makeVis, modelVis, trendVis, countTextVis, crashesGaugeVis,
    injuriesGaugeVis, firesGaugeVis, speedGaugeVis, scatterplotVis,
    mapVis;

var $makeBarChart = $("#make-bar-chart"),
	$modelBarChart = $("#model-bar-chart"),
	$trendVis = $("#trend"),
	$totalCountText = $("#total-count-text"),
	$crashesGauge = $("#crashes-gauge"),
	$injuriesGauge = $("#injuries-gauge"),
	$firesGauge = $("#fires-gauge"),
	$speedGauge = $("#speed-gauge"),
	$scatterplot = $("#scatterplot"),
    $map = $("#map"),
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
	    crashesGaugeVis.controller.state.removeFilter(filter);
	    injuriesGaugeVis.controller.state.removeFilter(filter);
	    firesGaugeVis.controller.state.removeFilter(filter);
	    speedGaugeVis.controller.state.removeFilter(filter);
	    scatterplotVis.controller.state.removeFilter(filter);
        if(mapVis) mapVis.controller.state.removeFilter(filter);
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

    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');
 
        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).css('display', 'inline').siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();

        if(!mapVis) {
            zoomdataClient.visualize({
                visualization: "Vehicle Complaints US Map",
                source: sourceName,
                element: $map.get(0)
            }).done(function(visualization) {
                mapVis = visualization;
            });
        }
    });

	// hideOverlay();
});

$( window ).resize(function() {
    makeVis.controller._controller.resize($makeBarChart.width(), $makeBarChart.height());
    modelVis.controller._controller.resize($modelBarChart.width(), $modelBarChart.height());
    trendVis.controller._controller.resize($trendVis.width(), $trendVis.height());
    scatterplotVis.controller._controller.resize($scatterplot.width(), $scatterplot.height());
    if(mapVis) mapVis.controller._controller.resize($mapVis.width(), $mapVis.height());
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
		    crashesGaugeVis.controller.state.setFilter(filter);
		    injuriesGaugeVis.controller.state.setFilter(filter);
		    firesGaugeVis.controller.state.setFilter(filter);
		    speedGaugeVis.controller.state.setFilter(filter);
	    	scatterplotVis.controller.state.setFilter(filter);
            if(mapVis) mapVis.controller.state.removeFilter(filter);
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
				    crashesGaugeVis.controller.state.setFilter(filter);
				    injuriesGaugeVis.controller.state.setFilter(filter);
				    firesGaugeVis.controller.state.setFilter(filter);
				    speedGaugeVis.controller.state.setFilter(filter);
				    scatterplotVis.controller.state.setFilter(filter);
                    if(mapVis) mapVis.controller.state.removeFilter(filter);
				} else {
				    var filter = {
				        path: 'year'
				    };

				    countTextVis.controller.state.removeFilter(filter);
				    crashesGaugeVis.controller.state.removeFilter(filter);
				    injuriesGaugeVis.controller.state.removeFilter(filter);
				    firesGaugeVis.controller.state.removeFilter(filter);
				    speedGaugeVis.controller.state.removeFilter(filter);
				    scatterplotVis.controller.state.removeFilter(filter);
                    if(mapVis) mapVis.controller.state.removeFilter(filter);
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
		    crashesGaugeVis.controller.state.setFilter(filter);
		    injuriesGaugeVis.controller.state.setFilter(filter);
		    firesGaugeVis.controller.state.setFilter(filter);
		    speedGaugeVis.controller.state.setFilter(filter);
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
    visualization: "Vehicle Crashes Gauge",
    source: sourceName,
    element: $crashesGauge.get(0)
}).done(function(visualization) {
	crashesGaugeVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Injuries Gauge",
    source: sourceName,
    element: $injuriesGauge.get(0)
}).done(function(visualization) {
	injuriesGaugeVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Fires Gauge",
    source: sourceName,
    element: $firesGauge.get(0)
}).done(function(visualization) {
	firesGaugeVis = visualization;
});

zoomdataClient.visualize({
    visualization: "Vehicle Speed Gauge",
    source: sourceName,
    element: $speedGauge.get(0)
}).done(function(visualization) {
	speedGaugeVis = visualization;
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

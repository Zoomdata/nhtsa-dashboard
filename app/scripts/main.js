
var apiKey = '53e569eae4b0a9e9da986978',
    host = 'daily.zoomdata.com/zoomdata',
    secure = true,
    sourceName = "Vehicle Complaints",
    lifted = false,
    hasNextDetails = true,
    loadingDetails = false,
    detailsOffset = 0,
    stateAbbreviationLookup = {'Alabama': 'AL','Alaska': 'AK','Arizona': 'AZ','Arkansas': 'AR','California': 'CA','Colorado': 'CO','Connecticut': 'CT','Delaware': 'DE','Florida': 'FL','Georgia': 'GA','Hawaii': 'HI','Idaho': 'ID','Illinois': 'IL','Indiana': 'IN','Iowa': 'IA','Kansas': 'KS','Kentucky': 'KY','Louisiana': 'LA','Maine': 'ME','Maryland': 'MD','Massachusetts': 'MA','Michigan': 'MI','Minnesota': 'MN','Mississippi': 'MS','Missouri': 'MO','Montana': 'MT','Nebraska': 'NE','Nevada': 'NV','New Hampshire': 'NH','New Jersey': 'NJ','New Mexico': 'NM','New York': 'NY','North Carolina': 'NC','North Dakota': 'ND','Ohio': 'OH','Oklahoma': 'OK','Oregon': 'OR','Pennsylvania': 'PA','Rhode Island': 'RI','South Carolina': 'SC','South Dakota': 'SD','Tennessee': 'TN','Texas': 'TX','Utah': 'UT','Vermont': 'VT','Virginia': 'VA','Washington': 'WA','West Virginia': 'WV','Wisconsin': 'WI', 'Wyoming': 'WY'},
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

var BooleanStringFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (rawValue, model) {
    if(!rawValue || rawValue === "" || rawValue === "0") {
        return '•';
    } else {
        return 'Y';
    }
  }
});

var BooleanStringCell = Backgrid.StringCell.extend({
  render: function () {
    BooleanStringCell.__super__.render.apply(this, arguments);
    if (this.$el.text() === "•") {
      this.el.classList.add("bullet");
    }
    return this;
  },
  formatter: BooleanStringFormatter
});

var NAStringFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (rawValue, model) {
    if(!rawValue || rawValue === "" || rawValue === "0") {
        return 'n/a';
    } else {
        return rawValue;
    }
  }
});

var NAStringCell = Backgrid.StringCell.extend({
  formatter: NAStringFormatter
});

var StateAbbreviationStringFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (rawValue, model) {
    return stateAbbreviationLookup[rawValue]
  }
});

var StateAbbreviationCell = Backgrid.StringCell.extend({
  formatter: StateAbbreviationStringFormatter
});

var columns = [
{
	name: "make",
    label: "MAKE",
    editable: false,
    sortable: false,
    cell: "string"
  }, {
    name: "model",
    label: "MODEL",
    editable: false,
    sortable: false,
    cell: "string"
  }, {
    name: "year",
    label: "YEAR",
    editable: false,
    sortable: false,
    cell: "string"
  }, {
    name: "state",
    label: "STATE",
    editable: false,
    sortable: false,
    cell: StateAbbreviationCell
  }, {
    name: "city",
    label: "CITY",
    editable: false,
    sortable: false,
    cell: "string"
  }, {
    name: "crashed",
    label: "CRASH",
    editable: false,
    sortable: false,
    cell: BooleanStringCell
  }, {
    name: "fire",
    label: "FIRE",
    editable: false,
    sortable: false,
    cell: BooleanStringCell
  }, {
    name: "injured",
    label: "INJURED",
    editable: false,
    sortable: false,
    cell: BooleanStringCell
  }, {
    name: "speed",
    label: "MPH",
    editable: false,
    sortable: false,
    cell: NAStringCell
  }, {
    name: "description",
    label: "FAILED COMPONENT",
    editable: false,
    sortable: false,
    cell: Backgrid.Cell.extend({
      className: "string-cell description",
      formatter: Backgrid.StringFormatter
    })
  }];

// Initialize a new Grid instance
var grid = new Backgrid.Grid({
  columns: columns,
  collection: records
});

// Render the grid and attach the root to your HTML document
$backgridContainer.append(grid.render().el);
var $backgridTBody = $backgridContainer.find('tbody');
resizeBackgrid();

$backgridTBody.scroll(function() {
    if( this.scrollHeight - $backgridTBody.height() - this.scrollTop < 200 && hasNextDetails && !loadingDetails){
        getDetails();
    }
});

$(document).ready(function() {
	$('button.reset').on('mousedown', function() {
    	var active = $modelBarChart.find('div.active');
    	active.toggleClass('active', false);

        Zoomdata.eventDispatcher.trigger("filter:years:reset");

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

    $('.button-container').click(function() {
        var $buttonContainer = $(this);
        if($buttonContainer.hasClass('active')) {
            closeHood();
        } else {
            openHood();
        }
    });

    $('.close-hood').click(function(){
        closeHood();
    });

    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');
 
        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).css('display', 'inline').siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();

        if(!mapVis && currentAttrValue === "#map-tab") {
            zoomdataClient.visualize({
                visualization: "Vehicle Complaints US Map",
                source: sourceName,
                element: $map.get(0)
            }).done(function(visualization) {
                mapVis = visualization;

                var filters = countTextVis.controller.state.filters.toJSON();
                mapVis.controller.state.addFilters(filters);
            });
        }
    });

	// hideOverlay();

    postionCarImageInBackground();
});

$( window ).resize(function() {
    resizeBackgrid();

    makeVis.controller._controller.resize($makeBarChart.width(), $makeBarChart.height());
    modelVis.controller._controller.resize($modelBarChart.width(), $modelBarChart.height());
    trendVis.controller._controller.resize($trendVis.width(), $trendVis.height());
    scatterplotVis.controller._controller.resize($scatterplot.width(), $scatterplot.height());
    if(mapVis) mapVis.controller._controller.resize($map.width(), $map.height());

    postionCarImageInBackground();

});

function postionCarImageInBackground() {
    var newBackgroundX = ($(".dashboard").offset().left + $(".dashboard").width() - 465) + "px";
    var newBackgroundY = ($(window).height() - 323) + "px";
    $("body").css({"background-position": newBackgroundX + " " + newBackgroundY});
}

function hideOverlay() {
	$overlay.velocity({ opacity: 0 }, { display: "none" });
	$(".overlay-description").velocity({ opacity: 0 }, { display: "none" });
	$(".overlay-instructions").velocity({ opacity: 0 }, { display: "none" });
}

function openHood() {
    var $buttonContainer = $('.button-container'),
        liftDuration = 2000;

    $buttonContainer.addClass('active');

    detailsOffset = 0;
    hasNextDetails = true;
    getDetails();

    $(".dashboard-foreground").velocity({
        rotateX: 90
    }, {
        easing: "easeOutBack",
        duration: liftDuration,
        complete: function() {
            $buttonContainer.find('.show-data').hide();
            $buttonContainer.find('.arrow-bottom').hide();
        }
    });

    var currentCount = $("#total-count-text").text();
    $("#dashboard-background-total").text(numberWithCommas(currentCount));

    $.Velocity.hook($(".dashboard-foreground"), "transformOrigin", "0px 0px");
    $.Velocity.hook($(".dashboard-foreground"), "perspectiveOrigin", "0px 0px");
}

function closeHood() {
    var $buttonContainer = $('.button-container'),
        liftDuration = 2000;

    $(".dashboard-foreground").velocity({ 
        rotateX: 0
    }, {
        duration: liftDuration,
        complete: function() {
            records.reset();

            $buttonContainer.removeClass('active');
            $buttonContainer.find('.show-data').show();
            $buttonContainer.find('.arrow-bottom').show();
        }
    });

    $.Velocity.hook($(".dashboard-foreground"), "transformOrigin", "0px 0px");
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

            var modelFilter = {
                path: 'model'
            };

		    modelVis.controller.state.setFilter(filter);

            countTextVis.controller.state.removeFilter(modelFilter, {silent:true});
		    countTextVis.controller.state.setFilter(filter);

            crashesGaugeVis.controller.state.removeFilter(modelFilter, {silent:true});
		    crashesGaugeVis.controller.state.setFilter(filter);

            injuriesGaugeVis.controller.state.removeFilter(modelFilter, {silent:true});
		    injuriesGaugeVis.controller.state.setFilter(filter);

            firesGaugeVis.controller.state.removeFilter(modelFilter, {silent:true});
		    firesGaugeVis.controller.state.setFilter(filter);

            speedGaugeVis.controller.state.removeFilter(modelFilter, {silent:true});
		    speedGaugeVis.controller.state.setFilter(filter);

            scatterplotVis.controller.state.removeFilter(modelFilter, {silent:true});
	    	scatterplotVis.controller.state.setFilter(filter);

            if(mapVis) {
                mapVis.controller.state.removeFilter(modelFilter, {silent:true});
                mapVis.controller.state.setFilter(filter);
            }
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
                    if(mapVis) mapVis.controller.state.setFilter(filter);
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
            if(mapVis) mapVis.controller.state.setFilter(filter);
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

function resizeBackgrid() {
    var tbodyHeight = $backgridContainer.height() - $backgridContainer.find('thead').height();
    $backgridTBody.css('height', tbodyHeight);

    var descriptionWidth = $backgridContainer.width() - 580;
    $('.backgrid thead th.description').css('width', descriptionWidth).css('max-width', descriptionWidth);
    $('.backgrid tbody td.description').css('width', descriptionWidth).css('max-width', descriptionWidth);
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
            // fromTime: 788947200000,
            // toTime: 1404975600000,
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

        resizeBackgrid();
    })
    .fail(function (response) {
        console.log('ERROR: ', response);
        loadingDetails = false;
    });
}

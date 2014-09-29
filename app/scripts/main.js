
// var apiKey = '53e569eae4b0a9e9da986978',
//     host = 'daily.zoomdata.com/zoomdata',
var apiKey = '5423cab5e4b0bc6347610a8b',
    host = '54.164.2.143/zoomdata',
    secure = true,
    sourceName = 'Vehicle Complaints',
    lifted = false,
    hasNextDetails = true,
    loadingDetails = false,
    detailsOffset = 0,
    verticalScrollThreshold = 590,
    stateAbbreviationLookup = {'Alabama': 'AL','Alaska': 'AK','Arizona': 'AZ','Arkansas': 'AR','California': 'CA','Colorado': 'CO','Connecticut': 'CT','Delaware': 'DE','Florida': 'FL','Georgia': 'GA','Hawaii': 'HI','Idaho': 'ID','Illinois': 'IL','Indiana': 'IN','Iowa': 'IA','Kansas': 'KS','Kentucky': 'KY','Louisiana': 'LA','Maine': 'ME','Maryland': 'MD','Massachusetts': 'MA','Michigan': 'MI','Minnesota': 'MN','Mississippi': 'MS','Missouri': 'MO','Montana': 'MT','Nebraska': 'NE','Nevada': 'NV','New Hampshire': 'NH','New Jersey': 'NJ','New Mexico': 'NM','New York': 'NY','North Carolina': 'NC','North Dakota': 'ND','Ohio': 'OH','Oklahoma': 'OK','Oregon': 'OR','Pennsylvania': 'PA','Rhode Island': 'RI','South Carolina': 'SC','South Dakota': 'SD','Tennessee': 'TN','Texas': 'TX','Utah': 'UT','Vermont': 'VT','Virginia': 'VA','Washington': 'WA','West Virginia': 'WV','Wisconsin': 'WI', 'Wyoming': 'WY'},
    loading = [],
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

var Rotated45HeaderCell = Backgrid.HeaderCell.extend({
  render: function () {
    Rotated45HeaderCell.__super__.render.apply(this, arguments);

    var text = this.$el.text(),
        html = $('<div><span>' + text + '</span></div>');

    this.$el.html(html);

    return this;
  }
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
    name: "crashed",
    label: "CRASH",
    editable: false,
    sortable: false,
    cell: BooleanStringCell,
    headerCell: Rotated45HeaderCell
  }, {
    name: "fire",
    label: "FIRE",
    editable: false,
    sortable: false,
    cell: BooleanStringCell,
    headerCell: Rotated45HeaderCell
  }, {
    name: "injured",
    label: "INJURY",
    editable: false,
    sortable: false,
    cell: BooleanStringCell,
    headerCell: Rotated45HeaderCell
  }, {
    name: "speed",
    label: "MPH",
    editable: false,
    sortable: false,
    cell: NAStringCell,
    headerCell: Rotated45HeaderCell
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

    $('.js-about-button').click(function(){
        showAboutOverlay();
    });

    $('.js-close-about-button').click(function(){
        hideAboutOverlay();
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
    positionSplat();
    positionCarImageInBackground();
    positionHoodReleaseButton();
    toggleYScrollability();
});

$( window ).resize(function() {
    resizeBackgrid();
    makeVis.controller._controller.resize($makeBarChart.width(), $makeBarChart.height());
    modelVis.controller._controller.resize($modelBarChart.width(), $modelBarChart.height());
    trendVis.controller._controller.resize($trendVis.width(), $trendVis.height());
    scatterplotVis.controller._controller.resize($scatterplot.width(), $scatterplot.height());
    if(mapVis) mapVis.controller._controller.resize($map.width(), $map.height());

    positionSplat();
    positionCarImageInBackground();
    positionHoodReleaseButton();
    toggleYScrollability();
});

function checkLoading() {
    // if(loading.length === 0) {
    //     hideSpinner();
    // } else {
    //     showSpinner();
    // }
}

function showSpinner(){
    $(".spinner-overlay").css("display", "block");
    
    window.setTimeout( function(){
            $(".spinner-overlay").css("opacity", 0.8);
        },0);
}

function hideSpinner(){
    $(".spinner-overlay").css("opacity", 0);
    window.setTimeout( function(){
            $(".spinner-overlay").css("display", "none");
        },500);
}



function positionSplat(){
    // make sure it is behind the make-wrapper
    var w = $(".make-wrapper");
    var s = $(".overlay-splat");
    var t= $(".overlay-title");

    // set size + position of splat
    s.css("width", w.width() * 3);
    s.css("height", w.height() + 200);
    s.css("left", ( (w.width() / 2) + w.offset().left) - (s.width() / 2));

    // set position of title
    t.css("top", w.offset().top);
    t.css("left", w.offset().left + w.width() + 75 + "px");
}

function positionHoodReleaseButton(){
    var newTop = $(".dashboard").height() - 67;
    $(".button-container").css("top", newTop + "px");

}

function toggleYScrollability(){
    if ( $("body").height() < verticalScrollThreshold ) 
        $("body").css("overflow-y", "visible");
    else
        $("body").css("overflow-y", "hidden");

}

function showAboutOverlay() {

    // remove splat stuff, replace with dark overlay
    $(".overlay-splat").hide();
    $(".overlay-title").hide();

    $overlay.css({"background-image": "none", "background-color": "rgba(0,0,0,0.8)"});

    var $aboutBlock = $('.about-block');

    $overlay.css("display", "inline");
    $overlay.velocity({ opacity: 1 });

    $aboutBlock.css("display", "block");
    $aboutBlock.velocity({ opacity: 1 });
}

function hideAboutOverlay() {
    var $aboutBlock = $('.about-block');

    $overlay.velocity({ opacity: 0 }, { display: "none" });
    $aboutBlock.velocity({ opacity: 0 }, { display: "none" });
}

function positionCarImageInBackground() {
    var newBackgroundX = ($(".dashboard").offset().left + $(".dashboard").width() - 465) + "px";

    // if background is scrolling, then show 
    if ( $(window).height() < verticalScrollThreshold)
        var newBackgroundY = (verticalScrollThreshold - 323) + "px";
    else
        var newBackgroundY = ($(window).height() - 323) + "px";
    $("body").css({"background-position": newBackgroundX + " " + newBackgroundY});
}

function hideOverlay() {
    $('.make-header').css('z-index', 1);
    $('.make-bar-chart').css('z-index', 1);

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
});

zoomdataClient.visualize({
    visualization: "Total Count Text",
    source: sourceName,
    element: $totalCountText.get(0)
}).done(function(visualization) {
    countTextVis = visualization;

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

zoomdataClient.visualize({
    visualization: "Vehicle Crashes Gauge",
    source: sourceName,
    element: $crashesGauge.get(0)
}).done(function(visualization) {
    crashesGaugeVis = visualization;

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

zoomdataClient.visualize({
    visualization: "Vehicle Injuries Gauge",
    source: sourceName,
    element: $injuriesGauge.get(0)
}).done(function(visualization) {
    injuriesGaugeVis = visualization;

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

zoomdataClient.visualize({
    visualization: "Vehicle Fires Gauge",
    source: sourceName,
    element: $firesGauge.get(0)
}).done(function(visualization) {
    firesGaugeVis = visualization;

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

zoomdataClient.visualize({
    visualization: "Vehicle Speed Gauge",
    source: sourceName,
    element: $speedGauge.get(0)
}).done(function(visualization) {
    speedGaugeVis = visualization;

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

zoomdataClient.visualize({
    visualization: "Vehicle Complaints Scatterplot",
    source: sourceName,
    element: $scatterplot.get(0)
}).done(function(visualization) {
    scatterplotVis = visualization;

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

zoomdataClient.visualize({
    visualization: "Brushing Year",
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
            if(mapVis) {
                mapVis.controller.state.setFilter(filter);
            }
        });

    visualization.controller.thread.on('thread:dirtyData', function() {
        if(loading.indexOf(visualization.name) === -1) {
            loading.push(visualization.name);
        }

        checkLoading();
    });

    visualization.controller.thread.on('thread:notDirtyData', function() {
        var index = loading.indexOf(visualization.name);
        if(index > -1) {
            loading.splice(index, 1);
        }

        checkLoading();
    });
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function resizeBackgrid() {
    var tbodyHeight = $backgridContainer.height() - $backgridContainer.find('thead').height();

    $backgridTBody.css('height', tbodyHeight);

    var descriptionWidth = $backgridContainer.width() - 441;
    $('.backgrid thead th.description').css('width', descriptionWidth + 1).css('min-width', descriptionWidth + 1).css('max-width', descriptionWidth + 1);
    $('.backgrid tbody td.description').css('width', descriptionWidth).css('min-width', descriptionWidth).css('max-width', descriptionWidth);
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

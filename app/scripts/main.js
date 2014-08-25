
var apiKey = '53e569eae4b0a9e9da986978',
    host = 'daily.zoomdata.com/zoomdata',
    secure = true,
    sourceName = "Vehicle Complaints";


var $makeBarChart = $("#make-bar-chart");

var zoomdataClient = new ZoomdataClient({
    apiKey: apiKey,
    host: host,
    secure: secure
});

zoomdataClient.visualize({
    visualization: "Vehicle Complaints Horizontal Bars",
    source: sourceName,
    element: $makeBarChart.get(0)
}).done(function(visualization) {
    visualization
        .controller
        .elementsManager
        .on('interaction', function (interactiveElement) {
        	var active = $makeBarChart.find('div.active');
        	active.toggleClass('active', false);
        	
            interactiveElement.$el.toggleClass('active');
        });
});
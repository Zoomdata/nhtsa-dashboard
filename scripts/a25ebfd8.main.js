function hideOverlay(){$overlay.velocity({opacity:0},{display:"none"}),$(".overlay-description").velocity({opacity:0},{display:"none"}),$(".overlay-instructions").velocity({opacity:0},{display:"none"})}function numberWithCommas(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function makePreviewEndpointURL(){var a=secure?"https://":"http://";return a+=host+"/service/stream/preview",a+="?key="+apiKey}function getDetails(){loadingDetails=!0;var a=countTextVis.controller.state.filters.toJSON();a.forEach(function(a){delete a.editable,a.value=a.value[0],a.operation="EQUALS"});var b=makeVis.controller.state.get("streamSourceId"),c=makePreviewEndpointURL(),d=15,e={count:d,offset:detailsOffset,restrictions:a,streamSourceId:b,timestampField:"failtimestamp_real"};$.ajax({type:"POST",url:c,data:JSON.stringify(e),contentType:"application/json"}).done(function(a){hasNextDetails=a.hasNext,records.add(a.documents),detailsOffset+=d,loadingDetails=!1}).fail(function(a){console.log("ERROR: ",a),loadingDetails=!1})}var apiKey="53e569eae4b0a9e9da986978",host="daily.zoomdata.com/zoomdata",secure=!0,sourceName="Vehicle Complaints",lifted=!1,hasNextDetails=!0,loadingDetails=!1,detailsOffset=0,makeVis,modelVis,trendVis,countTextVis,crashesGaugeVis,injuriesGaugeVis,firesGaugeVis,speedGaugeVis,scatterplotVis,mapVis,$makeBarChart=$("#make-bar-chart"),$modelBarChart=$("#model-bar-chart"),$trendVis=$("#trend"),$totalCountText=$("#total-count-text"),$crashesGauge=$("#crashes-gauge"),$injuriesGauge=$("#injuries-gauge"),$firesGauge=$("#fires-gauge"),$speedGauge=$("#speed-gauge"),$scatterplot=$("#scatterplot"),$map=$("#map"),$overlay=$(".overlay"),$backgridContainer=$(".backgrid-container"),Record=Backbone.Model.extend({}),Records=Backbone.Collection.extend({model:Record}),records=new Records,columns=[{name:"make",label:"MAKE",editable:!1,cell:"string"},{name:"model",label:"MODEL",editable:!1,cell:"string"},{name:"year",label:"YEAR",editable:!1,cell:"string"},{name:"crashed",label:"CRASHED",editable:!1,cell:"string"},{name:"fire",label:"FIRE",editable:!1,cell:"string"},{name:"injured",label:"INJURED",editable:!1,cell:"string"},{name:"description",label:"FAILED COMPONENT",editable:!1,cell:"string"},{name:"state",label:"STATE",editable:!1,cell:"string"},{name:"city",label:"CITY",editable:!1,cell:"string"}],grid=new Backgrid.Grid({columns:columns,collection:records});$backgridContainer.append(grid.render().el),$backgridContainer.scroll(function(){this.scrollHeight-$backgridContainer.height()-this.scrollTop<100&&hasNextDetails&&!loadingDetails&&getDetails()}),$(document).ready(function(){$("button.reset").on("mousedown",function(){var a=$modelBarChart.find("div.active");a.toggleClass("active",!1);var b={path:"model"};modelVis.controller.state.removeFilter(b),countTextVis.controller.state.removeFilter(b),crashesGaugeVis.controller.state.removeFilter(b),injuriesGaugeVis.controller.state.removeFilter(b),firesGaugeVis.controller.state.removeFilter(b),speedGaugeVis.controller.state.removeFilter(b),scatterplotVis.controller.state.removeFilter(b),mapVis&&mapVis.controller.state.removeFilter(b)}),$("button.show-data").on("mousedown",function(){var a=2e3;if(lifted)$(".dashboard-foreground").velocity({rotateX:0},{duration:a,complete:function(){records.reset()}}),$.Velocity.hook($(".dashboard-foreground"),"transformOrigin","0px 0px"),lifted=!1;else{detailsOffset=0,hasNextDetails=!0,getDetails(),$(".dashboard-foreground").velocity({rotateX:90},"easeOutBack",a);var b=$("#total-count-text").text();$("#dashboard-background-total").text(numberWithCommas(b)),$.Velocity.hook($(".dashboard-foreground"),"transformOrigin","0px 0px"),$.Velocity.hook($(".dashboard-foreground"),"perspectiveOrigin","0px 0px"),lifted=!0}}),$(".tabs .tab-links a").on("click",function(a){var b=$(this).attr("href");$(".tabs "+b).css("display","inline").siblings().hide(),$(this).parent("li").addClass("active").siblings().removeClass("active"),a.preventDefault(),mapVis||zoomdataClient.visualize({visualization:"Vehicle Complaints US Map",source:sourceName,element:$map.get(0)}).done(function(a){mapVis=a})}),hideOverlay()}),$(window).resize(function(){makeVis.controller._controller.resize($makeBarChart.width(),$makeBarChart.height()),modelVis.controller._controller.resize($modelBarChart.width(),$modelBarChart.height()),trendVis.controller._controller.resize($trendVis.width(),$trendVis.height()),scatterplotVis.controller._controller.resize($scatterplot.width(),$scatterplot.height()),mapVis&&mapVis.controller._controller.resize($mapVis.width(),$mapVis.height())});var zoomdataClient=new ZoomdataClient({apiKey:apiKey,host:host,secure:secure});zoomdataClient.visualize({visualization:"Horizontal Bars by Make",source:sourceName,element:$makeBarChart.get(0)}).done(function(a){makeVis=a,a.controller.elementsManager.on("interaction",function(a){$overlay.is(":visible")&&hideOverlay();var b=$makeBarChart.find("div.active");b.toggleClass("active",!1),a.$el.toggleClass("active");var c=a.data().group,d={operation:"IN",path:"make",value:[c]};modelVis.controller.state.setFilter(d),countTextVis.controller.state.setFilter(d),crashesGaugeVis.controller.state.setFilter(d),injuriesGaugeVis.controller.state.setFilter(d),firesGaugeVis.controller.state.setFilter(d),speedGaugeVis.controller.state.setFilter(d),scatterplotVis.controller.state.setFilter(d),mapVis&&mapVis.controller.state.removeFilter(d)}),setTimeout(function(){zoomdataClient.visualize({visualization:"Brushing Year Chart",source:sourceName,element:$trendVis.get(0)}).done(function(a){trendVis=a,Zoomdata.eventDispatcher.on("filter:years",function(a){if(a.length>0){var b={operation:"IN",path:"year",value:a};countTextVis.controller.state.setFilter(b),crashesGaugeVis.controller.state.setFilter(b),injuriesGaugeVis.controller.state.setFilter(b),firesGaugeVis.controller.state.setFilter(b),speedGaugeVis.controller.state.setFilter(b),scatterplotVis.controller.state.setFilter(b),mapVis&&mapVis.controller.state.removeFilter(b)}else{var b={path:"year"};countTextVis.controller.state.removeFilter(b),crashesGaugeVis.controller.state.removeFilter(b),injuriesGaugeVis.controller.state.removeFilter(b),firesGaugeVis.controller.state.removeFilter(b),speedGaugeVis.controller.state.removeFilter(b),scatterplotVis.controller.state.removeFilter(b),mapVis&&mapVis.controller.state.removeFilter(b)}})})},1e3)}),zoomdataClient.visualize({visualization:"Horizontal Bars by Model",source:sourceName,element:$modelBarChart.get(0)}).done(function(a){modelVis=a,a.controller.elementsManager.on("interaction",function(a){var b=$modelBarChart.find("div.active");b.toggleClass("active",!1),a.$el.toggleClass("active");var c=a.data().group,d={operation:"IN",path:"model",value:[c]};countTextVis.controller.state.setFilter(d),crashesGaugeVis.controller.state.setFilter(d),injuriesGaugeVis.controller.state.setFilter(d),firesGaugeVis.controller.state.setFilter(d),speedGaugeVis.controller.state.setFilter(d),scatterplotVis.controller.state.setFilter(d)})}),zoomdataClient.visualize({visualization:"Total Count Text",source:sourceName,element:$totalCountText.get(0)}).done(function(a){countTextVis=a}),zoomdataClient.visualize({visualization:"Vehicle Crashes Gauge",source:sourceName,element:$crashesGauge.get(0)}).done(function(a){crashesGaugeVis=a}),zoomdataClient.visualize({visualization:"Vehicle Injuries Gauge",source:sourceName,element:$injuriesGauge.get(0)}).done(function(a){injuriesGaugeVis=a}),zoomdataClient.visualize({visualization:"Vehicle Fires Gauge",source:sourceName,element:$firesGauge.get(0)}).done(function(a){firesGaugeVis=a}),zoomdataClient.visualize({visualization:"Vehicle Speed Gauge",source:sourceName,element:$speedGauge.get(0)}).done(function(a){speedGaugeVis=a}),zoomdataClient.visualize({visualization:"Vehicle Complaints Scatterplot",source:sourceName,element:$scatterplot.get(0)}).done(function(a){scatterplotVis=a});
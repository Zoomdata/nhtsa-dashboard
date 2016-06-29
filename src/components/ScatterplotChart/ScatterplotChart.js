import styles from './ScatterplotChart.css';

import React, { Component } from 'react';
import d3 from 'd3';
import { getWidth, getHeight } from '../../utilities';

export default class ScatterplotChart extends Component {
    shouldComponentUpdate() {
        return false;
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.data) {
            return;
        }
        this.updateChart(nextProps);
    }
    componentDidMount() {
        this.createChart();
    }
    componentWillUnmount() {
        d3.select(this.refs.scatterplotChart).remove();
    }
    render() {
        return <div className={styles.root} ref="scatterplotChart">

        </div>
    }

    createChart() {
        const chartElement = this.refs.scatterplotChart;
        const duration = 1000;
        let brushed = false;
        const widgetContent = d3.select(chartElement);
        const widgetContentNode = widgetContent.node();
        let tooltip;
        this.chart = scatterplotChart()
            .width(getWidth(chartElement))
            .height(getHeight(chartElement))
            .x(function(d) {
                const axisFormatter = d3.format('s');
                const formattedValue = axisFormatter(d);
                formattedValue.replace('G', 'B');
                return formattedValue;
            })
            .y(function(d) {
                const axisFormatter = d3.format('s');
                const formattedValue = axisFormatter(d);
                formattedValue.replace('G', 'B');
                return formattedValue;
            });

        this.updateChart = function(nextProps) {
            const data = nextProps.data || [];
            let dataset = data.map(function(d) {
                if (d.group && d.group.constructor === Array) {
                    d.group = d.group[0];
                }
                return d;
            });

            if (getWidth(chartElement) === 0) {
                return;
            }
            this.chart
                .width(getWidth(chartElement))
                .height(getHeight(chartElement));

            d3.select(chartElement)
                .datum(dataset)
                .call(this.chart);
        };

        function scatterplotChart() {
            let svg = null;
            let widgetHeight = 500;
            let widgetWidth = 500;
            let transitioning = false;
            let brushDomainX = [];
            let brushDomainY = [];
            let xDomainOrig = [];
            let yDomainOrig = [];
            let margin = {top: 15, right: 0, bottom: 35, left: 50};
            let width = widgetWidth - margin.left - margin.right;
            let height = widgetHeight - margin.top - margin.bottom;
            let x = d3.scale.linear();
            let y = d3.scale.linear().nice();
            let size = d3.scale.linear();
            let brush = d3.svg.brush().on('brush', brushmove).on('brushend', brushend);
            let xAxis = d3.svg.axis().scale(x).orient('bottom').outerTickSize(6).ticks(8).tickFormat(xValue);
            let yValue = function(d) { return d; };
            let xValue = function(d) { return d; };
            let yAxis = d3.svg.axis().scale(y).orient('left').outerTickSize(0).ticks(6).tickFormat(yValue);
            let groupKey = function(d) {
                return d.group;
            };
            let clearBrushButton = d3.select(chartElement)
                .append('button')
                .text('Reset Zoom')
                .attr('class', styles.clearZoom)
                .style('display', 'none')
                .on('click', function() {
                    x.domain(xDomainOrig).nice;
                    y.domain(yDomainOrig).nice;
                    transitioning = true;
                    d3.select(chartElement).selectAll(`.${styles.scatterGroup}`)
                        .transition()
                        .duration(duration)
                        .attr('transform', function(d) { return 'translate(' + x(d.current.metrics.injured.sum) + ',' + y(d.current.metrics.crashed.sum) + ')'; })
                        .call(endall, function() { transitioning = false; });

                    svg.select('g.main-group').call(redrawAxis);
                    brushed = false;
                    clearBrushButton.transition().duration(400).style('opacity').each('end', function() {
                        d3.select(this).style('display', 'none');
                    })
                });

            function chart(selection) {
                selection.each(function (data) {
                    if(!data) {
                        return;
                    }
                    width = widgetWidth - margin.left - margin.right;
                    height = widgetHeight - margin.top - margin.bottom;

                    if(transitioning) return;

                    updateAxisScales(data);

                    // Select the svg element, if it exists.
                    svg = d3.select(this).selectAll('svg').data([data]);

                    const svgEnter = svg.enter()
                        .append('svg')
                        .attr('width', '100%')
                        .attr('height', '100%');

                    const defs = svgEnter.append('defs');

                    defs.append('pattern')
                        .attr('id', 'stripes')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', 4)
                        .attr('height', 4)
                        .attr('patternUnits', 'userSpaceOnUse')
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', 4)
                        .attr('height', 2)
                        .style('stroke', 'none')
                        .style('opacity', 0.5)
                        .style('fill', '#A8A8A8');

                    defs.append('pattern')
                        .attr('id', 'scatter-circle-stripes')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', 2)
                        .attr('height', 2)
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('patternTransform', 'rotate(30)')
                        .append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', 2)
                        .attr('height', 1)
                        .style('stroke', 'none')
                        .style('fill', '#505050');

                    svgEnter.append('line')
                        .attr('x1', margin.left)
                        .attr('y1', 0)
                        .attr('x2', margin.left)
                        .attr('y2', margin.top)
                        .style('stroke-width', 1)
                        .style('stroke', 'black')
                        .style('shape-rendering', 'crispEdges');

                    svgEnter.append('rect')
                        .attr('height', margin.top)
                        .attr('width', '100%')
                        .attr('x', margin.left + 1)
                        .attr('fill', '#bababa');

                    svgEnter.append('text')
                        .attr('class', 'title')
                        .attr('x', margin.left + 5)
                        .attr('y', '8')
                        .attr('dy', '.3em')
                        .text('Size = Complaints')
                        .style('text-anchor', 'left')
                        .style('font-size', 11)
                        .style('fill', 'black')
                        .style('letter-spacing', '0.15em')
                        .style('text-transform', 'uppercase')
                        .style('font-weight', 700);

                    svgEnter.append('text')
                        .attr('class', 'label')
                        .attr('x', '-25%')
                        .attr('y', '9')
                        .attr('transform', 'rotate(-90)')
                        .text('Crashes')
                        .style('text-anchor', 'left')
                        .style('font-size', 13)
                        .style('fill', 'black')
                        .style('text-transform', 'uppercase')
                        .style('font-weight', 600);

                    svgEnter.append('text')
                        .attr('class', 'label')
                        .attr('x', '40%')
                        .attr('y', '99%')
                        .text('Injuries')
                        .style('text-anchor', 'left')
                        .style('font-size', 13)
                        .style('fill', 'black')
                        .style('text-transform', 'uppercase')
                        .style('font-weight', 600);

                    const gEnter = svgEnter.append('g')
                        .attr('class', 'main-group');

                    gEnter.append('g').attr('class', styles.brush).call(brush);

                    gEnter.select(`g.${styles.brush}`).insert('rect', 'rect.background')
                        .attr('class', styles.stripedBackground);

                    svg.select(`rect.${styles.stripedBackground}`)
                        .attr('width', width)
                        .attr('height', height);

                    gEnter.select('rect.background')
                        .style('visibility', null);

                    gEnter.append('g')
                        .attr('class', 'scatterplot-area')
                        .append('g')
                        .attr('class', 'scatterplot-group');

                    // Draw the X and Y Axis for the first time
                    gEnter.call(drawAxis);

                    // Update the inner group dimensions.
                    const g = svg.select('g.main-group')
                        .attr('transform', 'translate(' + (margin.left) + ',' + (margin.top) + ')');

                    // Refresh the Axis position and text labels
                    g.call(redrawAxis);

                    // Redraw the brush to account for changes in width and height
                    g.select(`.${styles.brush}`).call(brush);

                    const scatterGroup = g.select('.scatterplot-group').selectAll(`.${styles.scatterGroup}`)
                        .data(data, groupKey);

                    const scatterEnterGroup = scatterGroup.enter()
                        .append('g')
                        .attr('class', styles.scatterGroup)
                        .attr('transform', function(d) {
                            return 'translate(' + x(d.current.metrics.injured.sum) + ',' + y(d.current.metrics.crashed.sum) + ')';
                        })
                        .style('opacity',  Math.random() / 2 + 0.5)
                        .on('mouseover', mouseover)
                        .on('mousemove', mousemove)
                        .on('mouseout', mouseleave);

                    scatterEnterGroup
                        .append('circle')
                        .attr('class', 'dot');

                    scatterEnterGroup
                        .append('circle')
                        .attr('class', 'pattern');

                    scatterGroup
                        .transition()
                        .duration(duration)
                        .attr('transform', function(d) {
                            return 'translate(' + x(d.current.metrics.injured.sum) + ',' + y(d.current.metrics.crashed.sum) + ')';
                        });

                    scatterGroup.select('circle.dot')
                        .attr('r', function(d) { return size(Math.abs(d.current.count)); })
                        .style('fill', '#00e8ff')
                        .style('opacity', 1);

                    scatterGroup.select('circle.pattern')
                        .attr('r', function(d) { return size(Math.abs(d.current.count)); })
                        .style('fill', 'url(#scatter-circle-stripes)')
                        .style('opacity', 1);

                    scatterGroup.exit()
                        .transition()
                        .duration(duration)
                        .attr('r', 0)
                        .style('opacity', 1e-6)
                        .remove();
                })
            }

            function mouseover(d) {
                widgetContent.selectAll(`.${styles.tooltips}`).remove();
                const elementColor = d3.select(this).select('circle').style('fill');
                const absoluteMousePos = d3.mouse(widgetContentNode);
                tooltip = d3.select(chartElement).append('div').attr('class', styles.tooltips).style('opacity', 0);
                tooltip.style('opacity', 0.9)
                    .style('background', 'white')
                    .style('border-color', elementColor)
                    .style('left', (absoluteMousePos[0] + 10)+'px')
                    .style('top', (absoluteMousePos[1] - 40)+'px');

                const fields = ['Crashed', 'Injuries', 'Fires', 'Avg. Speed', 'Complaints'],
                    dataObject = {
                        Crashed: d.current.metrics.crashed.sum,
                        Injuries: d.current.metrics.injured.sum,
                        Fires: d.current.metrics.fire.sum,
                        'Avg. Speed': d.current.metrics.speed.avg,
                        Complaints: d.current.count
                    };
                let html = `<div class="${styles.tooltipMarkerTitle}">${d.group}</div>`;
                for (var i=0; i < fields.length; i++) {
                    var value = dataObject[fields[i]];
                    if(fields[i] === 'Avg. Speed') {
                        value = Math.round(value) + 'MPH';
                    } else {
                        value = addCommas(value);
                    }

                    html += `<br /><div class="${styles.tooltipLeft}">${fields[i]}</div><div class="${styles.tooltipRight}">${value}</div>`;
                }

                tooltip.html(html);
            }

            function mousemove() {
                var absoluteMousePos = d3.mouse(widgetContentNode);
                tooltip.style('left', (absoluteMousePos[0] + 10)+'px')
                    .style('top', (absoluteMousePos[1] - 40)+'px');

                if(parseInt(tooltip.style('left')) + parseInt(tooltip.style('width')) + (parseInt(tooltip.style('padding')) * 2) + parseInt(tooltip.style('border-radius')) + parseInt(tooltip.style('border')) > widgetWidth) {
                    tooltip.style('left', function() {
                        return (parseInt(tooltip.style('left')) - parseInt(tooltip.style('width')) - (parseInt(tooltip.style('padding')) * 2) - parseInt(tooltip.style('border-radius')) - parseInt(tooltip.style('border')) - 10) + 'px';
                    });
                }

                if(parseInt(tooltip.style('top')) - (parseInt(tooltip.style('padding')) * 2) - parseInt(tooltip.style('border-radius')) - parseInt(tooltip.style('border')) < 0) {
                    tooltip.style('top', function() {
                        return (parseInt(tooltip.style('top')) + (parseInt(tooltip.style('padding')) * 2) + parseInt(tooltip.style('border-radius')) + parseInt(tooltip.style('border'))) + 'px';
                    });
                }

                if(parseInt(tooltip.style('top')) + parseInt(tooltip.style('height')) + (parseInt(tooltip.style('padding')) * 2) + parseInt(tooltip.style('border-radius')) + parseInt(tooltip.style('border')) > widgetHeight) {
                    tooltip.style('top', function() {
                        return (parseInt(tooltip.style('top')) - (parseInt(tooltip.style('padding')) * 2) - parseInt(tooltip.style('border-radius')) - parseInt(tooltip.style('border'))) + 'px';
                    });
                }
            }

            // Mouseleave Handler
            function mouseleave() {
                tooltip.style('opacity', 0)
                tooltip.remove();
            }

            function updateAxisScales(data) {
                // Update the x-scale & y-scale domain
                const minMetricValueX = d3.min(data, function(d) {
                    return d.current.metrics.injured.sum;
                });
                const minMetricValueY = d3.min(data, function(d) {
                    return d.current.metrics.crashed.sum;
                });

                const absMaxMetricValueX = d3.max(data, function(d) {
                    return Math.abs(d.current.metrics.injured.sum);
                });
                const absMaxMetricValueY = d3.max(data, function(d) {
                    return Math.abs(d.current.metrics.crashed.sum);
                });
                const absMaxMetricValueSize = d3.max(data, function(d) {
                    return Math.abs(d.current.count);
                });

                xDomainOrig = [minMetricValueX < 0 ? -absMaxMetricValueX : 0, absMaxMetricValueX];
                yDomainOrig = [minMetricValueY < 0 ? -absMaxMetricValueY : 0, absMaxMetricValueY];
                const xDomain = brushed ? brushDomainX : xDomainOrig,
                    xRange = [0, width];
                const yDomain = brushed ? brushDomainY : yDomainOrig,
                    yRange = [height, 0];
                const sizeDomain = [0, absMaxMetricValueSize],
                    sizeRange = [5, 25];

                if ((brushed ? x.domain()[0] : minMetricValueX) < 0) {
                    xDomain[0] = -absMaxMetricValueX;
                    xDomainOrig[0] = -absMaxMetricValueX;
                    xRange[0] = 0;
                }
                if ((brushed ? y.domain()[0] : minMetricValueY) < 0) {
                    yDomain[0] = -absMaxMetricValueY;
                    yDomainOrig[0] = -absMaxMetricValueY;
                    yRange[0] = height;
                }

                x.range(xRange).domain(xDomain).nice();
                y.range(yRange).domain(yDomain).nice();
                size.range(sizeRange).domain(sizeDomain).nice();

                brush.x(x).y(y);
            }

            function brushmove() {
                const extent = brush.extent();
                if(brush.empty()) {
                    return;
                }
                d3.select(chartElement).selectAll(`.${styles.scatterGroup}`).classed(styles.selected, function(d) {
                    var is_brushed = extent[0][0] <= x.invert(x(d.current.metrics.injured.sum)) && x.invert(x(d.current.metrics.injured.sum)) <= extent[1][0]
                        && extent[0][1] <= y.invert(y(d.current.metrics.crashed.sum)) && y.invert(y(d.current.metrics.crashed.sum)) <= extent[1][1];
                    return is_brushed;
                });
            }

            function brushend() {
                if(brush.empty()) {
                    return;
                }

                brushed = true;
                brushDomainX = [brush.extent()[0][0], brush.extent()[1][0]];
                brushDomainY = [brush.extent()[0][1], brush.extent()[1][1]];
                x.domain(brushDomainX).nice;
                y.domain(brushDomainY).nice;

                clearBrushButton.transition().duration(400).style('opacity').each('end', function() {
                    d3.select(this).style('display', 'block');
                })

                transitioning = true;
                d3.select(chartElement).selectAll(`.${styles.scatterGroup}`)
                    .transition()
                    .duration(duration)
                    .attr('transform', function(d) {
                        return 'translate(' + x(d.current.metrics.injured.sum) + ',' + y(d.current.metrics.crashed.sum) + ')';
                    })
                    .call(endall, function() { transitioning = false; });

                svg.select('g.main-group').call(redrawAxis);

                d3.select(chartElement).selectAll(`.${styles.scatterGroup}`).classed(styles.selected, false);
                d3.select(chartElement).select(`.${styles.brush}`).call(brush.clear());
            }

            // Draw the X and Y Axis for the first time
            function drawAxis() {
                this.append('g')
                    .attr('class', styles.x)
                    .attr('transform', 'translate(0, ' + y(0) + ')')
                    .call(xAxis);

                this.append('g')
                    .attr('class', styles.y)
                    .attr('transform', 'translate(' + x(0) + ', 0)')
                    .call(yAxis);
            }

            // Update the positions and values of the X and Y Axis
            function redrawAxis() {
                // Update the x-axis based on the updated xScale range
                this.select(`.${styles.x.split(' ')[0]}`)
                    .attr('transform', function() {
                        if(y.domain()[0] >= 0) {
                            return 'translate(0, ' + y(y.domain()[0]) + ')';
                        } else if (y.domain()[0] < 0 && y.domain()[1] < 0) {
                            return 'translate(0, ' + y(y.domain()[1]) + ')';
                        } else {
                            return 'translate(0, ' + y(0) + ')';
                        }
                    })
                    .call(xAxis);

                // Update the y-axis based on the updated yScale range
                this.select(`.${styles.y.split(' ')[0]}`)
                    .attr('transform', function() {
                        if(x.domain()[0] >= 0) {
                            return 'translate(' + x(x.domain()[0]) + ', 0)';
                        } else if (x.domain()[0] < 0 && x.domain()[1] < 0) {
                            return 'translate(' + x(x.domain()[1]) + ', 0)';
                        } else {
                            return 'translate(' + x(0) + ', 0)';
                        }
                    })
                    .call(yAxis);

                var ticks = this.selectAll(`.${styles.x.split(' ')[0]} > g.tick`);
                var lastTick = ticks[0][ticks[0].length - 1];
                d3.select(lastTick).select('text').style('text-anchor', 'end');
            }

            function endall(transition, callback) {
                var n = 0;
                transition
                    .each(function() { ++n; })
                    .each('end', function() { if (!--n) callback.apply(this, arguments); });
            }
            
            chart.margin = function (_) {
                if (!arguments.length) return margin;
                margin = _;
                width = widgetWidth - margin.left - margin.right;
                height = widgetHeight - margin.top - margin.bottom;
                return chart;
            };
            chart.width = function (_) {
                if (!arguments.length) return widgetWidth;
                widgetWidth = _;
                width = widgetWidth - margin.left - margin.right;
                return chart;
            };

            chart.height = function (_) {
                if (!arguments.length) return widgetHeight;
                widgetHeight = _;
                height = widgetHeight - margin.top - margin.bottom;
                return chart;
            };

            chart.x = function(_) {
                if (!arguments.length) return xValue;
                xValue = _;
                xAxis.tickFormat(xValue);
                return chart;
            };

            chart.y = function(_) {
                if (!arguments.length) return yValue;
                yValue = _;
                yAxis.tickFormat(yValue);
                return chart;
            };
            return chart;
        }
        function addCommas(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }
    }
}
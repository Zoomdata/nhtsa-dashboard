import styles from './TrendChart.css';

import React, { Component } from 'react';
import d3 from 'd3';
import { getWidth, getHeight } from '../../utilities';

export default class TrendChart extends Component {
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
        d3.select(this.refs.trendChart).remove();
    }
    render() {
        return <div className={styles.root} ref="trendChart">

        </div>
    }

    createChart() {
        let onBrushEnd;
        let filterStatus;
        const chartElement = this.refs.trendChart;
        this.chart = trendChart()
            .width(getWidth(chartElement))
            .height(getHeight(chartElement));

        this.updateChart = function(nextProps) {
            filterStatus = nextProps.filterStatus;
            onBrushEnd = nextProps.onBrushEnd;
            const data = nextProps.data || [];
            let dataset = data.map(function(d) {
                if (d.group && d.group.constructor === Array) {
                    d.group = d.group[0];
                }
                return d;
            });

            this.chart
                .width(getWidth(chartElement))
                .height(getHeight(chartElement));

            d3.select(chartElement)
                .datum(dataset)
                .call(this.chart);
        };

        function trendChart() {
            let svg = null;
            let brushExtent = [90, 360];
            let bars = null;
            let widgetHeight = 500;
            let widgetWidth = 500;
            let barWidth = 30;
            let margin = {top: 0, right: 0, bottom: 0, left: 45};
            let width = widgetWidth - margin.left - margin.right;
            let height = widgetHeight - margin.top - margin.bottom;
            let xScale = d3.scale.ordinal();
            let yScale = d3.scale.linear();
            let currentBarPadding = 0.1;
            let currentOuterPadding = 0;
            let brush = d3.svg.brush()
                .x(xScale)
                .on('brush', brushmove)
                .on('brushend', brushend);
            let groupKey = function(d) {
                return d.group;
            };

            function chart(selection) {
                selection.each(function (data) {
                    if(!data) {
                        return;
                    }
                    if (filterStatus === 'FILTERS_RESET') {
                        d3.select(this).select(`.${styles.brush}`)
                            .transition()
                            .call(brush.extent(brushExtent))
                            .call(brush.event);
                    }
                    width = data.length * barWidth;
                    height = widgetHeight - margin.top - margin.bottom;

                    updateAxisScales(data);

                    // Select the svg element, if it exists.
                    svg = d3.select(this).selectAll('svg').data([data]);

                    const svgEnter = svg.enter()
                        .append('svg')
                        .attr('width', '100%')
                        .attr('height', '100%');

                    const gEnter = svgEnter.append('g')
                        .attr('class', 'main-group');

                    const defs = gEnter.append('defs');

                    defs.append('pattern')
                        .attr('id', 'year-bar-stripes')
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

                    defs.append('pattern')
                        .attr('id', 'year-brush-stripes')
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
                        .style('fill', '#78C9D1');

                    gEnter.append('g')
                        .attr('class', styles.barsGroup);

                    const brushEnter = gEnter.append('g')
                        .attr('class', styles.brush)
                        .call(brush);

                    brushEnter.selectAll('.resize.w').append('image')
                        .attr('xlink:href', 'data:image/png;base64,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')
                        .attr('width', 45)
                        .attr('height', 40)
                        .attr('x', -44);

                    brushEnter.selectAll('.resize.e').append('image')
                        .attr('xlink:href', 'data:image/png;base64,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')
                        .attr('width', 45)
                        .attr('height', 40);

                    gEnter.append('g')
                        .attr('class', 'labels-group');

                    svg.select(`g.${styles.brush}`)
                        .selectAll('rect')
                        .attr('height', height);

                    // Update the inner group dimensions.
                    const g = svg.select('g.main-group')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    // Update the bars background width
                    g.select('.bar-background')
                        .attr('width', width < widgetWidth ? widgetWidth - margin.left - margin.right : width)
                        .attr('height', height);

                    bars = g.select(`.${styles.barsGroup}`).selectAll(`rect.${styles.bar}`)
                        .data(data, groupKey);

                    const labels = g.select('.labels-group').selectAll(`text.${styles.label}`)
                        .data(data, groupKey);

                    bars.enter()
                        .append('rect')
                        .attr('class', styles.bar)
                        .attr('width', xScale.rangeBand())
                        .attr('height', function(d) {
                            return Math.abs(yScale(d.current.count) - yScale(0));
                        })
                        .attr('x', function(d) {
                            return xScale(d.group)
                        })
                        .attr('y', function(d) { return d.current.count < 0 ? yScale(0) : yScale(d.current.count); });

                    labels.enter()
                        .append('text')
                        .attr('class', styles.label)
                        .attr('x', function(d) {
                            return xScale(d.group) + 3;
                        })
                        .attr('y', function() {
                            return yScale(0) - 5;
                        })
                        .text(function(d) {
                            return '‘' + d.group.substring(2);
                        });

                    // Remove any unnecessary bar groups
                    bars.exit()
                        .remove();

                    labels.exit()
                        .remove();

                    setTimeout(function() {
                        brushEnter
                            .call(brush.extent(brushExtent))
                            .call(brush.event);
                    }, 500);
                })
            }

            function updateAxisScales(data) {
                // Update the scales in case the data has changed
                xScale.domain(data.map(groupKey))
                    .rangeRoundBands([0, width], currentBarPadding, currentOuterPadding);

                // Update the y-scale domain
                const minMetricValue = d3.min(data, function(d) {
                    return d.current.count;
                });

                const absMaxMetricValue = d3.max(data, function(d) {
                    return Math.abs(d.current.count);
                });

                const yScaleDomain = [0, absMaxMetricValue];
                if(minMetricValue < 0) {
                    yScaleDomain[0] = -absMaxMetricValue;
                }

                yScale.range([height, 0]).domain(yScaleDomain).nice();
            }

            function brushmove() {
                var extent0 = brush.extent(),
                    extent1;

                if (d3.event.mode === 'move') {
                    const d0 = Math.floor(extent0[0] / barWidth) * barWidth,
                        d1 = d0 + (Math.ceil((extent0[1] - extent0[0]) / barWidth) * barWidth);
                    extent1 = [d0, d1];
                } else {
                    extent1 = [
                        Math.floor(extent0[0] / barWidth) * barWidth,
                        Math.ceil(extent0[1] / barWidth) * barWidth
                    ];
                }

                bars.classed(styles.selected, function(d) {
                    const x = xScale(d.group);
                    return extent1[0] <= x + barWidth / 2 && x <= extent1[1];
                });

                d3.select(this)
                    .call(brush.extent(extent1));
            }

            function brushend() {
                var isEmpty = d3.event.target.empty();

                if(isEmpty) {
                    var extent = d3.event.target.extent(),
                        snappedWidth = Math.floor(extent[0] / barWidth) * barWidth,
                        buffer = 3;

                    d3.select(this)
                        .call(brush.extent([snappedWidth + buffer, snappedWidth + barWidth - buffer]))
                        .call(brush.event);
                } else {
                    const selectedYears = bars.filter(`.${styles.selected}`).data().map(function(d) {
                        return d.group;
                    });

                    const changeFilterStatus = (brush.extent()[0] === brushExtent[0]) && (brush.extent()[1] === brushExtent[1]) ?
                        false :
                        true
                    onBrushEnd(selectedYears, changeFilterStatus);
                }
            }

            chart.margin = function (_) {
                if (!arguments.length) return margin;
                margin = _;
                width = widgetWidth - margin.left - margin.right;
                height = widgetHeight - margin.top - margin.bottom;
                return chart;
            };

            chart.width = function(_) {
                if (!arguments.length) return widgetWidth;
                widgetWidth = _;
                width = widgetWidth - margin.left - margin.right;
                return chart;
            };

            chart.height = function(_) {
                if (!arguments.length) return widgetHeight;
                widgetHeight = _;
                height = widgetHeight - margin.top - margin.bottom;
                return chart;
            };

            return chart;
        }
    }
}
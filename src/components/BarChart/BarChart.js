import styles from './BarChart.css';

import React, { Component } from 'react';
import d3 from 'd3';
import { getWidth, getHeight } from '../../utilities';

d3.selection.prototype.first = function() {
    return d3.select(this[0][0]);
};
d3.selection.prototype.last = function() {
    var last = this.size() - 1;
    return d3.select(this[0][last]);
};

export default class BarChart extends Component {
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
        d3.select(this.refs.barChart).remove();
    }
    render() {
        return <div className={styles.root} ref="barChart">

        </div>
    }

    createChart() {
        let activeBar;
        let onClick;
        const chartElement = this.refs.barChart;
        const duration = 1000;
        const vendorPrefix = getVendorPrefix();
        let datasetLength = 0;
        this.chart = barChart()
            .width(getWidth(chartElement))
            .height(getHeight(chartElement))
            .x(function(d) {
                const axisFormatter = d3.format('s');
                const formattedValue = axisFormatter(d);
                formattedValue.replace('G', 'B');
                return formattedValue;
            });

        this.updateChart = function(nextProps) {
            activeBar = nextProps.activeBar;
            onClick = nextProps.onClick;
            const data = nextProps.data || [];
            let dataset = data.map(function(d) {
                if (d.group && d.group.constructor === Array) {
                    d.group = d.group[0];
                }
                return d;
            });
            datasetLength = data.length;
            this.chart
                .width(getWidth(chartElement))
                .height(getHeight(chartElement));

            d3.select(chartElement)
                .datum(dataset)
                .call(this.chart);
        };

        function barChart() {
            let svg = null;
            let layout = null;
            let widgetHeight = 500;
            let widgetWidth = 500;
            let margin = {top: 0, right: 1, bottom: 0, left: 0};
            let width = widgetWidth - margin.left - margin.right;
            let height = widgetHeight - margin.top - margin.bottom;
            let barHeight = 26;
            let minBarHeight;
            let maxBarHeight = 26;
            let yScale = d3.scale.ordinal();
            let xScale = d3.scale.linear();
            let xAxisScale = d3.scale.linear();
            let xValue = function(d) { return d; };
            let xAxis = d3.svg.axis().scale(xAxisScale).orient('top').ticks(3).tickFormat(xValue);
            let currentBarPadding = 0;
            let currentOuterPadding = 0;
            let groupKey = function(d) {
                    return d.group;
                };

            function chart(selection) {
                selection.each(function (data) {
                    if(!data) {
                        return;
                    }
                    makeResponsive();
                    width = widgetWidth;
                    height = data.length * barHeight;

                    updateAxisScales(data);

                    // Select the svg element, if it exists.
                    svg = d3.select(this).selectAll('svg').data([data]);

                    svg.enter()
                        .append('svg')
                        .attr('width', '100%')
                        .attr('height', '100%')
                        .append('g')
                        .attr('transform', 'translate(0,20)');
                    layout = d3.select(this).selectAll(`.${styles.widgetLayout}`).data([data]);

                    let divEnter = layout.enter()
                        .append('div')
                        .attr('class', styles.widgetLayout)
                        .append('div')
                        .attr('class', styles.mainGroup);

                    let barsGroup = divEnter.append('div')
                        .attr('class', 'bar-area')
                        .append('div')
                        .attr('class', styles.barsGroup);

                    barsGroup.append('div')
                        .attr('class', 'bars-background')
                        .style('top', 0)
                        .style('left', 0);

                    // Draw the X and Y Axis for the first time
                    if (!svg.selectAll(`.${styles.axis}`)[0].length) {
                        svg.select('g').call(drawAxis);
                    }

                    // Update the inner group dimensions.
                    let mainGroup = layout.select(`div.${styles.mainGroup}`)
                        .style('top', margin.top + 'px')
                        .style('left', (margin.left + 1) + 'px');

                    mainGroup.select('.bars-background')
                        .style('width', (width - margin.right) + 'px')
                        .style('height', height - margin.top - margin.bottom + 'px');

                    // Refresh the Axis position and text labels
                    svg.select('g').call(redrawAxis);

                    // Update the bars background width
                    mainGroup.select('div.bar-background')
                        .style('width', (width < widgetWidth ? widgetWidth - margin.left - margin.right : width) + 'px')
                        .style('height', height + 'px');

                    let bars = mainGroup.select(`.${styles.barsGroup}`).selectAll(`div.${styles.barGroup}`)
                        .data(data, groupKey);

                    let barsEnterGroup = bars.enter()
                        .append('div')
                        .attr('class', function(d, i) {
                            return (i % 2) === 0 ? styles.barGroupEven : styles.barGroupOdd;
                        })
                        .style(vendorPrefix + 'transform', function(d) {
                            return 'translate3d(0, ' + (yScale(d.group) - 1) + 'px, 0)';
                        });

                    barsEnterGroup
                        .append('div')
                        .attr('class', styles.bar)
                        .style('height', (yScale.rangeBand() - currentBarPadding) + 'px')
                        .style('width', 0);

                    // Append the bar text label
                    barsEnterGroup
                        .append('div')
                        .attr('class', styles.label)
                        .text(groupKey);

                    // Append the bar text label
                    barsEnterGroup
                        .append('div')
                        .attr('class', styles.value)
                        .text(function(d) {
                            return addCommas(d.current.count);
                        });

                    // Update Bar Group Positions
                    if (activeBar) {
                        const changeToActive = bars.filter(function() {
                            return d3.select(this).datum().group === activeBar;
                        });
                        changeToActive.classed(styles.barGroupActive, true);
                    } else {
                        const active = d3.select(this).selectAll(`div.${styles.barGroupActive}`);
                        active.classed(styles.barGroupActive, false);
                    }

                    bars
                        .style('height', (yScale.rangeBand() - currentBarPadding) + 'px')
                        .style(vendorPrefix + 'transform', function(d) {
                            return 'translate3d(0, ' + yScale(d.group) + 'px, 0)';
                        })
                        .on('click', function(d) {
                            if (activeBar === d.group) {
                                return;
                            }
                            const active = d3.select(chartElement).selectAll(`div.${styles.barGroupActive}`);
                            const hideOverlay = active.empty() ? true : false;
                            active.classed(styles.barGroupActive, false);
                            d3.select(this).classed(styles.barGroupActive, true);
                            onClick(d.group, hideOverlay);
                        });

                    bars.select(`div.${styles.bar}`)
                        .style('height', '100%')
                        .transition()
                        .delay(function(d, i) { return i / data.length * duration; })
                        .style('width', function(d) {
                            return xScale(d.current.count) + 'px';
                        });

                    bars.select(`div.${styles.label}`)
                        .text(groupKey);

                    bars.select(`div.${styles.value}`)
                        .text(function(d) {
                            return addCommas(d.current.count);
                        });


                    // Remove any unnecessary bar groups
                    bars.exit()
                        .remove();
                })
            }

            function updateAxisScales(data) {
                // Update the scales in case the data has changed
                yScale.domain(data.map(groupKey))
                    .rangeRoundBands([0, height], currentBarPadding, currentOuterPadding);

                // Update the x-scale domain
                let minMetricValue = d3.min(data, function(d) {
                    return d.current.count;

                });

                let absMaxMetricValue = d3.max(data, function(d) {
                    return Math.abs(d.current.count);
                });

                let xScaleDomain = [0, absMaxMetricValue];
                if(minMetricValue < 0) {
                    xScaleDomain[0] = -absMaxMetricValue;
                }

                xAxisScale.range([1, width - margin.right]).domain(xScaleDomain).nice();
                xScale.range([0, width - margin.right]).domain(xScaleDomain).nice();
            }

            // Draw the X and Y Axis for the first time
            function drawAxis() {
                this.append('g')
                    .attr('class', styles.axis)
                    .call(xAxis);
            }

            // Update the positions and values of the X and Y Axis
            function redrawAxis() {
                // Update the x-axis based on the updated xScale range
                this.select(`.${styles.axis}`)
                    .attr('transform', 'translate(0, 0)')
                    .call(xAxis);

                let $el = d3.select(chartElement);
                let ticks = $el.selectAll(`.${styles.axis} > g.tick`);
                let firstTick = ticks.first();
                let lastTick = ticks.last();

                firstTick.selectAll('text').style('text-anchor', 'start');
                lastTick.selectAll('text').style('text-anchor', 'end');
            }

            function makeResponsive() {
                minBarHeight = 25;
                var newBarHeight = Math.round((widgetHeight - margin.top - margin.bottom) / (datasetLength || 1));
                newBarHeight = newBarHeight > maxBarHeight ? maxBarHeight : newBarHeight;
                barHeight = newBarHeight < minBarHeight ? minBarHeight : newBarHeight;
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
                if (!arguments.length) return height;
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
            return chart;
        }
        function getVendorPrefix() {
            var styles = window.getComputedStyle(document.documentElement, ''),
                pre = (Array.prototype.slice
                        .call(styles)
                        .join('')
                        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                )[1];
            return '-' + pre + '-';
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
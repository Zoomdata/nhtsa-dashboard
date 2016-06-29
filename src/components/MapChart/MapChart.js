import styles from './MapChart.css';

import React, { Component } from 'react';
import d3 from 'd3';
import { getWidth, getHeight } from '../../utilities';
import { stateShapes } from './stateShapes';

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
        return <div className={styles.root} ref="mapChart">

        </div>
    }

    createChart() {
        const chartElement = this.refs.mapChart;
        const statesData = stateShapes;
        let width = getWidth(chartElement);
        let height = getHeight(chartElement);
        let logScale = d3.scale.log();
        let linearScale = d3.scale.linear();
        const widgetContentNode = d3.select(chartElement).node();
        const dataLookup = {};
        let tooltip;
        let colorScale = linearScale
            .domain([1, 2])
            .range(['rgb(222,235,247)', 'rgb(8,48,107)']);
        const projection = d3.geo.albersUsa()
            .scale(1)
            .translate([0, 0]);
        const path = d3.geo.path()
            .projection(projection);
        const b = d3.geo.bounds(statesData);
        let s = 150 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);

        projection
            .scale(s)
            .translate([width / 2, height / 2]);
        const svg = d3.select(chartElement).append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g');

        const instructions = g.append('text')
            .attr('class', styles.instructions)
            .attr('y', 11)
            .text('Brighter = More Complaints');

        instructions.attr('x', function() {
            return width - this.getBBox().width - 50;
        });

        g.append('g')
            .attr('id', 'states')
            .selectAll('path')
            .data(statesData.features)
            .enter().append('path')
            .attr('d', path)
            .attr('class', styles.state)
            .attr('id', function(d) {
                return d.properties.name.replace(' ', '_');
            })
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        this.updateChart = function(nextProps) {
            width = getWidth(chartElement);
            height = getHeight(chartElement);

            projection.scale(width * 0.8)
                .translate([width / 2, height / 2]);
            svg.attr('width', width)
                .attr('height', height);

            svg.selectAll(`path.${styles.state}`)
                .attr('d', path);

            instructions.attr('x', function() {
                return width - this.getBBox().width - 50;
            });
            const data = nextProps.data || [];
            let dataset = data.map(function(d) {
                if (d.group && d.group.constructor === Array) {
                    d.group = d.group[0];
                }
                return d;
            });

            const colorDomain = d3.extent(dataset, function(d) {
                return d.current.count;
            });

            colorScale = logScale;
            colorScale
                .domain(colorDomain)
                .range(['#424242', '#8DD1DB']);

            dataset.forEach(function(item) {
                const groupId = item.group.replace(' ', '_');
                const colorValue = item.current.count;
                const color = colorScale(colorValue);

                dataLookup[item.group] = {
                    Crashed: item.current.metrics.crashed.sum,
                    Injuries: item.current.metrics.injured.sum,
                    Fires: item.current.metrics.fire.sum,
                    'Avg. Speed': item.current.metrics.speed.avg,
                    Complaints: colorValue
                };

                g.select('#'+groupId).style('fill', color);
            });
        };

        function mouseover(d) {
            d3.select(chartElement).selectAll(`.${styles.tooltips}`).remove();
            const elementColor = d3.select(this).style('fill');
            const absoluteMousePos = d3.mouse(widgetContentNode);
            tooltip = d3.select(chartElement).append('div').attr('class', styles.tooltips).style('opacity', 0);
            tooltip.style('opacity', 0.9)
                .style('background', 'white')
                .style('border-color', elementColor)
                .style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 40)+'px');

            const fields = ['Crashed', 'Injuries', 'Fires', 'Avg. Speed', 'Complaints'],
                dataObject = dataLookup[d.properties.name];
            let html = `<div class='${styles.tooltipMarkerTitle}'>${d.properties.name}</div>`;
            for (var i=0; i < fields.length; i++) {
                var value = dataObject[fields[i]];
                if(fields[i] === 'Avg. Speed') {
                    value = Math.round(value) + 'MPH';
                } else {
                    value = addCommas(value);
                }

                html += `<br /><div class='${styles.tooltipLeft}'>${fields[i]}</div><div class='${styles.tooltipRight}'>${value}</div>`;
            }

            tooltip.html(html);
        }

        function mousemove() {
            var absoluteMousePos = d3.mouse(widgetContentNode);
            tooltip.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 40)+'px');

            if(parseInt(tooltip.style('left')) + parseInt(tooltip.style('width')) + (parseInt(tooltip.style('padding')) * 2) + parseInt(tooltip.style('border-radius')) + parseInt(tooltip.style('border')) > width) {
                tooltip.style('left', function() {
                    return (parseInt(tooltip.style('left')) - parseInt(tooltip.style('width')) - (parseInt(tooltip.style('padding')) * 2) - parseInt(tooltip.style('border-radius')) - parseInt(tooltip.style('border')) - 10) + 'px';
                });
            }

            if(parseInt(tooltip.style('top')) - (parseInt(tooltip.style('padding')) * 2) - parseInt(tooltip.style('border-radius')) - parseInt(tooltip.style('border')) < 0) {
                tooltip.style('top', function() {
                    return (parseInt(tooltip.style('top')) + (parseInt(tooltip.style('padding')) * 2) + parseInt(tooltip.style('border-radius')) + parseInt(tooltip.style('border'))) + 'px';
                });
            }

            if(parseInt(tooltip.style('top')) + parseInt(tooltip.style('height')) + (parseInt(tooltip.style('padding')) * 2) + parseInt(tooltip.style('border-radius')) + parseInt(tooltip.style('border')) > height) {
                tooltip.style('top', function() {
                    return (parseInt(tooltip.style('top')) - (parseInt(tooltip.style('padding')) * 2) - parseInt(tooltip.style('border-radius')) - parseInt(tooltip.style('border'))) + 'px';
                });
            }
        }

        // Mouseleave Handler
        function mouseout() {
            tooltip.style('opacity', 0)
            tooltip.remove();
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
import styles from './GaugeChart.css';

import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';

export default class GaugeChart extends Component {
    shouldComponentUpdate() {
        return false;
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.data || !nextProps.max) {
            return;
        }
        this.updateChart(nextProps);
    }
    componentDidMount() {
        this.createChart();
    }
    componentWillUnmount() {
        this.chart.dispose();
    }
    render() {
        return <div className={styles.root} ref="gaugeChart">

        </div>
    }

    createChart() {
        const chartElement = this.refs.gaugeChart;
        this.chart = echarts.init(chartElement);
        const { chartName } = this.props;
        const option = {
            series: [
                {
                    type: 'gauge',
                    radius: '100%',
                    min: 0,
                    axisLine: {
                        lineStyle: {
                            color: [[1, '#878787']],
                            width: 10
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: '#4C4C4C'
                        }
                    },
                    pointer: {
                        width: 5
                    },
                    title: {
                        offsetCenter: [0, '80%'],
                        textStyle: {
                            color: '#4c4c4c',
                            fontSize: 9,
                            fontWeight: 'bold',
                            fontFamily: 'Source Sans Pro,source-sans-pro,sans-serif'
                        }
                    },
                    detail: {
                        textStyle: {
                            color: '#F6EBE6',
                            fontSize: 18,
                            fontFamily: 'AF-LED7Seg-3,Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace'
                        },
                        offsetCenter: [0, '48%'],
                        formatter: function(value) {
                            return addCommas(value);
                        }
                    },
                    data: [{value: 0, name: chartName}]
                }
            ]
        };
        this.chart.setOption(option, false);
        this.updateChart = function(nextProps) {
            const data = nextProps.data || [];
            const max = nextProps.max || [];
            const chartName = nextProps.name;
            let dataset;
            let maxDataset;
            let metricName;
            let metricFunc;
            let percentValue;
            if (chartName === 'CRASHES') {
                metricName = 'crashed';
                metricFunc = 'sum';
                dataset = data[0].current.metrics[metricName][metricFunc];
                maxDataset = max[0].current.metrics[metricName][metricFunc];
                percentValue = Math.round(dataset/maxDataset * 100);
            } else if (chartName === 'INJURIES') {
                metricName = 'injured';
                metricFunc = 'sum';
                dataset = data[0].current.metrics[metricName][metricFunc];
                maxDataset = max[0].current.metrics[metricName][metricFunc];
                percentValue = Math.round(dataset/maxDataset * 100);
            } else if (chartName === 'FIRES') {
                metricName = 'fire';
                metricFunc = 'sum';
                dataset = data[0].current.metrics[metricName][metricFunc];
                maxDataset = max[0].current.metrics[metricName][metricFunc];
                percentValue = Math.round(dataset/maxDataset * 100);
            } else {
                metricName = 'speed';
                metricFunc = 'avg';
                dataset = data[0].current.metrics[metricName][metricFunc].toPrecision(2);
                maxDataset = 200
                percentValue = Math.round(dataset/maxDataset * 100);
            }
            option.series[0].data = [{value: dataset, name: chartName}];
            option.series[0].max = maxDataset;
            this.chart.setOption(option, false);
            const unit = new echarts.graphic.Text({
                style: {
                    text: metricName === 'speed' ? 'MPH' : percentValue + '%',
                    textAlign: 'center',
                    x: 60,
                    y: 9,
                    color: '#4c4c4c',
                    textFont: '10px Source Sans Pro,source-sans-pro,sans-serif'
                },
                z: 3
            });
            this.chart._chartsViews[0].group.add(unit);
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
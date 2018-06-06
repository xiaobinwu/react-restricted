import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    timeTicket = null;
    count = 51;
    getInitialState = () => ({ option: this.getOption() });

    fetchNewDate = () => {
        const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
        const { option } = this.state;
        option.title.text = `Hello Echarts-for-react.${new Date().getSeconds()}`;
        const data0 = option.series[0].data;
        const data1 = option.series[1].data;
        data0.shift();
        data0.push(Math.round(Math.random() * 1000));
        data1.shift();
        data1.push(((Math.random() * 10) + 5).toFixed(1) - 0);

        option.xAxis[0].data.shift();
        option.xAxis[0].data.push(axisData);
        option.xAxis[1].data.shift();
        option.xAxis[1].data.push(this.count += 1);
        this.setState({ option });
    };

    componentDidMount() {
        if (this.timeTicket) {
            clearInterval(this.timeTicket);
        }
        this.timeTicket = setInterval(this.fetchNewDate, 1000);
    }

    componentWillUnmount() {
        if (this.timeTicket) {
            clearInterval(this.timeTicket);
        }
    }

    getOption = () => ({
        title: {
            text: 'Hello Echarts-for-react.',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最新成交价', '预购队列']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        grid: {
            top: 60,
            left: 30,
            right: 60,
            bottom: 30
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (() => {
                    let now = new Date();
                    const res = [];
                    let len = 50;
                    while (len--) { // eslint-disable-line
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (() => {
                    const res = [];
                    let len = 50;
                    while (len--) { // eslint-disable-line
                        res.push(50 - len + 1); // eslint-disable-line
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '价格',
                max: 20,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '预购量',
                max: 1200,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '预购队列',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 4,
                    }
                },
                animationEasing: 'elasticOut',
                animationDelay(idx) {
                    return idx * 10;
                },
                animationDelayUpdate(idx) {
                    return idx * 10;
                },
                data: (() => {
                    const res = [];
                    let len = 50;
                    while (len--) { // eslint-disable-line
                        res.push(Math.round(Math.random() * 1000));
                    }
                    return res;
                })()
            },
            {
                name: '最新成交价',
                type: 'line',
                data: (() => {
                    const res = [];
                    let len = 0;
                    while (len < 50) {
                        res.push((Math.random() * 10 + 5).toFixed(1) - 0); // eslint-disable-line
                        len += 1;
                    }
                    return res;
                })()
            }
        ]
    });

    render() {
        return (
            <div className='examples' style={{ marginTop: 40 }}>
                <div className='parent'>
                    <ReactEcharts ref='echarts_react'
                        option={this.state.option}
                        style={{ height: 400, width: '100%' }} />
                </div>
            </div>
        );
    }
}

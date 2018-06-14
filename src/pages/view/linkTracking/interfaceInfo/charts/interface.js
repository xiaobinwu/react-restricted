import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Interface extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
        if (nextProps && nextProps.setting) {
            this.setState({
                option: { ...this.getOption(), ...nextProps.setting }
            });
        }
    }
    getInitialState = () => ({ option: this.getOption() });
    getOption = () => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            right: '20px'
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['耗时', 'QPS']
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '耗时',
                position: 'left',
                axisLabel: {
                    formatter: '{value} ms'
                }
            },
            {
                type: 'value',
                name: 'QPS',
                position: 'left',
                offset: 80,
                axisLabel: {
                    formatter: '{value} 个'
                }
            }
        ],
        series: [
            {
                name: '耗时',
                type: 'line',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            {
                name: 'QPS',
                type: 'line',
                yAxisIndex: 1,
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
        ]
    });

    render() {
        return (
            <div>
                <ReactEcharts ref='echarts_react'
                    option={this.state.option}
                    style={{ height: 500, width: '100%' }} />
            </div>
        );
    }
}

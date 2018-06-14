import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class ThroughPut extends Component {
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
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['入站', '出站'],
            x: 'right'
        },
        xAxis: [
            {
                show: false,
                type: 'category',
                axisTick: {
                    alignWithLabel: false
                },
                axisLine: {
                    onZero: false,
                },
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '入站',
                type: 'bar',
                smooth: true,
                data: []
            },
            {
                name: '出站',
                type: 'line',
                smooth: true,
                data: []
            }
        ]
    });

    render() {
        return (
            <div>
                <ReactEcharts ref='echarts_react'
                    option={this.state.option}
                    style={{ height: 320, width: '100%' }} />
            </div>
        );
    }
}

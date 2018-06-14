import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Qps extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    getInitialState = () => ({ option: this.getOption() });
    UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line
        if (nextProps && nextProps.setting) {
            this.setState({
                option: { ...this.getOption(), ...nextProps.setting }
            });
        }
    }
    getOption = () => ({
        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['平均', '1分钟', '5分钟', '15分钟'],
            x: 'left'
        },
        xAxis: [
            {
                data: []
            }
        ],
        yAxis: {},
        series: [
            {
                name: '平均',
                type: 'line',
                smooth: true,
                data: []
            },
            {
                name: '1分钟',
                type: 'line',
                smooth: true,
                data: []
            },
            {
                name: '5分钟',
                type: 'line',
                smooth: true,
                data: []
            },
            {
                name: '15分钟',
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

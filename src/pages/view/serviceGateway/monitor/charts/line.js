import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Line extends Component {
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
        graphic: [
            {
                id: 'showBack',
                type: 'text',
                left: 'center',
                top: 'center',
                z: 0,
                style: {
                    fill: '#d8d9da',
                    text: '0/S',
                    font: '30px Microsoft YaHei'
                }
            }

        ],
        grid: {
            top: 4,
            bottom: 20,
            right: 0,
            left: 0
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
                data: (() => {
                    const res = [];
                    let len = 20;
                    while (len--) { // eslint-disable-line
                        res.push(0);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                show: false,
                type: 'value'
            }
        ],
        series: [
            {
                name: '',
                type: 'line',
                smooth: true,
                data: (() => {
                    const res = [];
                    let len = 20;
                    while (len--) { // eslint-disable-line
                        res.push(0);
                    }
                    return res;
                })()
            }
        ]
    });

    render() {
        return (
            <div>
                <ReactEcharts ref='echarts_react'
                    option={this.state.option}
                    style={{ height: 200, width: '100%' }} />
            </div>
        );
    }
}

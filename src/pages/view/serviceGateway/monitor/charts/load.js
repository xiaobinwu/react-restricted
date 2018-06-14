import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Load extends Component {
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
            show: false
        },
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [
            {
                type: 'bar',
                barWidth: '50%',
                data: []
            },

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

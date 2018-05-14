import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    getInitialState = () => ({ option: this.getOption() });


    getOption = () => ({
        color: ['#2b83f9'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['谷歌', '百度', 'Bing', '搜狗', '360', 'Sfrai', 'Opera'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
            }
        ]
    });

    render() {
        return (
        <div className='examples' style={{marginTop: 40}}>
            <div className='parent'>
            <ReactEcharts ref='echarts_react'
                option={this.state.option}
                style={{height: 400, width: 780}} />
            </div>
        </div>
        );
    }
}
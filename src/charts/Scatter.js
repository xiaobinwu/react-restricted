import React, { Component } from 'react';
import ReactEcharts from 'component/echarts-for-react';

export default class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    getInitialState = () => ({ option: this.getOption() });


    getOption = () => ({
        legend: {
            data: ['图一','图二', '张三', '李四']
        },
        radar: [
            {
                indicator: [
                    { text: '指标一' },
                    { text: '指标二' },
                    { text: '指标三' },
                    { text: '指标四' },
                    { text: '指标五' }
                ],
                center: ['25%', '50%'],
                radius: 120,
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',
                name: {
                    formatter:'【{value}】',
                }
            },
            {
                indicator: [
                    { text: '语文', max: 150 },
                    { text: '数学', max: 150 },
                    { text: '英语', max: 150 },
                    { text: '物理', max: 120 },
                    { text: '化学', max: 108 },
                    { text: '生物', max: 72 }
                ],
                center: ['75%', '50%'],
                radius: 120
            }
        ],
        series: [
            {
                name: '雷达图',
                type: 'radar',
                itemStyle: {
                    emphasis: {
                        // color: 各异,
                        lineStyle: {
                            width: 4
                        }
                    }
                },
                data: [
                    {
                        value: [100, 8, 0.40, -80, 2000],
                        name: '图一',
                        symbol: 'rect',
                        symbolSize: 5,
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        }
                    },
                    {
                        value: [60, 5, 0.30, -100, 1500],
                        name: '图二',
                    }
                ]
            },
            {
                name: '成绩单',
                type: 'radar',
                radarIndex: 1,
                data: [
                    {
                        value: [120, 118, 130, 100, 99, 70],
                        name: '张三',
                        label: {
                            normal: {
                                show: true,
                                formatter:function(params) {
                                    return params.value;
                                }
                            }
                        }
                    },
                    {
                        value: [90, 113, 140, 30, 70, 60],
                        name: '李四',
                        areaStyle: {
                            normal: {
                                opacity: 0.9
                            }
                        }
                    }
                ]
            }
        ]
    });

    render() {
        return (
        <div className='examples' style={{marginTop: 40}}>
            <div className='parent'>
            <ReactEcharts ref='echarts_react'
                option={this.state.option}
                style={{height: 400, width: '100%'}} />
            </div>
        </div>
        );
    }
}
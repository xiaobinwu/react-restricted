import React, { Component } from 'react';
import { Card, Col, Row, Select, Table, Icon, Divider } from 'antd';
import gatewayService from 'service/gatewayService';
import { roundNumber } from 'js/util';
import Load from './charts/load'; // 负载情况
import Qps from './charts/qps'; // QPS情况
import Line from './charts/line'; // 服务折线
import ThroughPut from './charts/throughPut'; // 流量实时情况
import styles from './index.css';

const { Option } = Select;

class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serverList: [],
            selectedServerValue: '',
            serverLineData: [
                {
                    span: 7,
                    type: 'countSuccess', // 总数(参考)
                    value: 0,
                    dec: '总数(参考)'
                },
                {
                    span: 4,
                    type: 'rollingCountSuccess', // 当前请求
                    value: 0,
                    dec: '当前请求'
                },
                {
                    span: 2,
                    type: 'rollingCountShortCircuited', // 熔断
                    value: 0,
                    dec: '熔断'
                },
                {
                    span: 2,
                    type: 'rollingCountSemaphoreRejected', // 拒绝
                    value: 0,
                    dec: '拒绝'
                },
                {
                    span: 2,
                    type: 'rollingCountFailure', // 降级
                    value: 0,
                    dec: '降级'
                },
                {
                    span: 2,
                    type: 'errorCount', // 错误
                    value: 0,
                    dec: '错误'
                },
                {
                    span: 2,
                    type: 'rollingMaxConcurrentExecutionCount', // 饱和
                    value: 0,
                    dec: '饱和'
                },
                {
                    span: 3,
                    type: 'errorPercentage', // 错误率
                    value: 0,
                    dec: '错误率',
                    suffix: '%'
                }
            ],
            serverLatencyData: [
                {
                    title: 'Mean',
                    type: 'latencyExecute_mean',
                    value: 0
                },
                {
                    title: 'Median',
                    type: 'latencyExecute_percentile_50',
                    value: 0
                },
                {
                    title: '90TH',
                    type: 'latencyExecute_percentile_90',
                    value: 0
                },
                {
                    title: '99TH',
                    type: 'latencyExecute_percentile_99',
                    value: 0
                },
                {
                    title: '995TH',
                    type: 'latencyExecute_percentile_995',
                    value: 0
                }
            ],
            loadOptions: null,
            qpsOptions: null,
            lineOptions: null,
            throughPutOptions: null,
            hotServiceData: [],
            errorServiceData: [],
            threadData: [],
            writeKb: 0,
            readKb: 0
        };
        this.hotServiceColumns = [
            {
                title: 'SERVICE',
                dataIndex: 'service',
                key: 'service'
            },
            {
                title: 'TO',
                key: 'totalCount',
                dataIndex: 'totalCount',
                width: 130
            }
        ];
        this.errorServiceColumns = [
            {
                title: 'SERVICE',
                dataIndex: 'service',
                key: 'service'
            },
            {
                title: 'TO',
                key: 'errorCount',
                dataIndex: 'errorCount',
                width: 130
            }
        ];
        this.threadColumns = [
            {
                title: 'SERVICE',
                dataIndex: 'service',
                key: 'service'
            },
            {
                title: '拒绝',
                dataIndex: 'rollingCountCommandsRejected',
                key: 'rollingCountCommandsRejected',
                width: 120
            },
            {
                title: '活动',
                dataIndex: 'rollingMaxActiveThreads',
                key: 'rollingMaxActiveThreads',
                width: 50
            },
            {
                title: '饱和度',
                key: 'saturation',
                dataIndex: 'saturation',
                width: 80,
                render(text) {
                    return (<strong>{text}%</strong>);
                }
            }
        ];
    }
    componentDidMount() {
        this.connectWebSocket();
    }
    componentWillUnmount() {
        // 销毁socket连接
        this.io && this.io.close(); // eslint-disable-line
        this.io = null;
    }
    UNSAFE_componentWillMount() { // eslint-disable-line
        this.getServerList();
        this.getQps();
        this.getHotService();
        this.getErrorService();
    }
    // QPS实时情况与流量实时情况初始化
    getQps = async () => {
        const { data } = await gatewayService.getQps();
        if (data && data.length > 0) {
            this.queryQps(data);
            this.getThroughPut(data);
        }
    }
    // 错误服务初始化
    getErrorService = async () => {
        const { data } = await gatewayService.getErrorService();
        if (data && data.length > 0) {
            this.errorService(data);
        }
    }
    // 流量实时情况初始化
    getThroughPut = (data) => {
        if (data && data.length > 0) {
            const times = [];
            const readKbs = [];
            const writeKbs = [];
            let readKb;
            let writeKb;
            data.forEach((item, index) => {
                times.splice(0, 0, item.localTime);
                readKbs.splice(0, 0, item.readKb);
                writeKbs.splice(0, 0, item.writeKb);
                if (index === 0 && item.readKb) {
                    readKb = item.readKb.toFixed(2);
                    writeKb = item.readKb.toFixed(2);
                }
            });
            this.setState({
                writeKb: writeKb || '0.00',
                readKb: readKb || '0.00',
                throughPutOptions: {
                    xAxis: [
                        {
                            data: times
                        }
                    ],
                    series: [
                        {
                            data: readKbs
                        },
                        {
                            data: writeKbs
                        }
                    ]
                }
            });
        }
    }
    // 热点服务初始化
    getHotService = async () => {
        const { data } = await gatewayService.getHotService();
        if (data && data.length > 0) {
            this.hotService(data);
        }
    }
    // 获取服务列表
    getServerList = async () => {
        const { data } = await gatewayService.getServerList();
        if (data && data.length > 0) {
            const filterData = data.map((item, index) => { // eslint-disable-line
                return {
                    ip: item.ip,
                    serverId: item.serverId
                };
            });
            this.setState({
                serverList: filterData,
                selectedServerValue: `${filterData[0].ip || ''}-${filterData[0].serverId || ''}`
            });
        }
    }
    // 创建websocket
    connectWebSocket = () => {
        this.io = gatewayService.getWebSocket();
        this.io.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const { type, value } = data;
            switch (type) {
            case 1: {
                this.traffic(value);
                break;
            }
            case 2: {
                this.errorService(value);
                break;
            }
            case 3: {
                this.hotService(value);
                break;
            }
            case 4: {
                this.load(value);
                break;
            }
            default:
                this.serverLine(value);
            }
        };
        this.io.onclose = (e) => {
            console.log('webSocket Close!');
        };
    }
    // websockit下实时更新负载情况监控
    load = (data) => {
        const xAxisData = [];
        const seriesData = [];
        if (data && data.length > 0) {
            data.forEach((element) => {
                xAxisData.push(element.serverId);
                seriesData.push(element.totalCount);
            });
        }
        this.setState({
            loadOptions: {
                xAxis: [
                    {
                        data: xAxisData
                    }
                ],
                series: [
                    {
                        data: seriesData
                    }
                ]
            }
        });
    }
    // websockit下实时更新QPS
    queryQps = (data) => {
        const times = [];
        const meanQps = [];
        const meanQps1 = [];
        const meanQps5 = [];
        const meanQps15 = [];
        data.forEach((item) => {
            times.splice(0, 0, item.localTime);
            meanQps.splice(0, 0, item.qps_mean);
            meanQps1.splice(0, 0, item.qps_1minute);
            meanQps5.splice(0, 0, item.qps_5minute);
            meanQps15.splice(0, 0, item.qps_15minute);
        });
        this.setState({
            qpsOptions: {
                xAxis: [
                    {
                        data: times
                    }
                ],
                series: [
                    {
                        data: meanQps
                    },
                    {
                        data: meanQps1
                    },
                    {
                        data: meanQps5
                    },
                    {
                        data: meanQps15
                    }
                ]
            }
        });
    }
    // websockit下实时更新流量实时情况,以及QPS实时情况
    traffic = (data) => {
        const {
            qps_mean,
            qps_1minute,
            qps_5minute,
            qps_15minute,
            localTime,
            readKb,
            writeKb
        } = data;
        if (!readKb) { return; }
        if (this.qpsRef) {
            const qpsOption = { ...this.qpsRef.getOption() };
            const qpsDataMean = qpsOption.series[0].data;
            const qpsData1 = qpsOption.series[1].data;
            const qpsData5 = qpsOption.series[2].data;
            const qpsData15 = qpsOption.series[3].data;
            const xAxis2 = qpsOption.xAxis[0].data;
            qpsDataMean.shift();
            qpsDataMean.push(qps_mean);
            qpsData1.shift();
            qpsData1.push(qps_1minute);
            qpsData5.shift();
            qpsData5.push(qps_5minute);
            qpsData15.shift();
            qpsData15.push(qps_15minute);
            xAxis2.shift();
            xAxis2.push(localTime);
            this.setState({
                qpsOptions: qpsOption
            });
        }
        if (this.throughPutRef) {
            const throughputOption = { ...this.throughPutRef.getOption() };
            const data0 = throughputOption.series[0].data;
            const data1 = throughputOption.series[1].data;
            const xAxis = throughputOption.xAxis[0].data;
            data0.shift();
            data0.puhs(readKb);
            data1.shift();
            data1.push(writeKb);
            xAxis.shift();
            xAxis.push(localTime);
            this.setState({
                readKb: readKb.toFixed(2),
                writeKb: writeKb.toFixed(2),
                throughPutOptions: throughputOption
            });
        }
    }
    // 错误服务实时情况
    errorService = (data) => {
        if (data && data.length > 0) {
            data.forEach((item, index) => {
                item.key = index;
            });
            this.setState({
                errorServiceData: data
            });
        }
    }
    // websockit下实时更新热点服务情况
    hotService = (data) => {
        if (data && data.length > 0) {
            data.forEach((item, index) => {
                item.key = index;
            });
            this.setState({
                hotServiceData: data
            });
        }
    }
    // websockit下实时更新服务请求情况
    serverLine = (data) => {
        const {
            selectedServerValue,
            serverLineData,
            serverLatencyData
        } = this.state;
        if (data.length === 0) {
            return;
        }
        if (selectedServerValue && this.lineRef) {
            let currentData = data[0];  // eslint-disable-line
            data.some((item) => { // eslint-disable-line
                if (item.serverId === selectedServerValue) {
                    currentData = item;
                    return true;
                }
            });
            serverLineData.forEach((item) => {
                item.value = currentData[item.type];
            });
            serverLatencyData.forEach((item) => {
                item.value = currentData[item.type];
            });
            const totalThreadsExecuted = currentData.totalCount > 0 ? currentData.totalCount : 0;
            const ratePer = roundNumber(totalThreadsExecuted / 10);
            const nextSeriesData = [...this.lineRef.getOption().series[0].data];
            nextSeriesData.shift();
            nextSeriesData.push(ratePer);
            this.setState({
                serverLineData,
                serverLatencyData,
                lineOptions: {
                    graphic: [
                        {
                            style: {
                                text: `${ratePer}/S`
                            }
                        }
                    ],
                    series: [
                        {
                            data: nextSeriesData
                        }
                    ]
                }
            });
        }
    }
    // 生成布局
    constructClass = (index) => { // eslint-disable-line
        return `${styles.title} system-monitor-title-${index}`;
    }
    render() {
        const {
            serverList,
            selectedServerValue,
            loadOptions,
            qpsOptions,
            lineOptions,
            throughPutOptions,
            serverLineData,
            serverLatencyData,
            hotServiceData,
            errorServiceData,
            threadData,
            readKb,
            writeKb
        } = this.state;

        const hotServiceColumns = this.hotServiceColumns;  // eslint-disable-line
        const errorServiceColumns = this.errorServiceColumns; // eslint-disable-line
        const threadColumns = this.threadColumns; // eslint-disable-line

        const serverListView = (
            <Select style={{ width: '100%' }} value={selectedServerValue}>
                {
                    serverList.map((item, index) => { // eslint-disable-line
                        return (<Option value={`${item.ip}-${item.serverId}`} key={index}>{item.ip}-{item.serverId}</Option>);
                    })
                }
            </Select>
        );

        const colLayout = { textAlign: 'center' };
        const latencyLeftLayout = { textAlign: 'left', margin: '10px 0' };
        const latencyRightLayout = { textAlign: 'right', margin: '10px 0' };

        const serverLatencyView = (
            <React.Fragment>
                {
                    serverLatencyData.map((item, index) => { // eslint-disable-line
                        return (<Row key={index} className='system-monitor-border-bottom'>
                            <Col style={latencyLeftLayout} span={12}>{item.title}</Col>
                            <Col style={latencyRightLayout} span={12}>{item.value}Ms</Col>
                        </Row>);
                    })
                }
            </React.Fragment>
        );

        const serverMonitorView = (
            <Row style={{ marginBottom: '10px' }}>
                {
                    serverLineData.map((item, index) => { // eslint-disable-line
                        return (<Col span={item.span} style={colLayout} key={index} className={index === 0 ? 'system-monitor-border-right' : ''}>
                            <div className={this.constructClass(index)}>{item.value}{item.suffix}</div>
                            <div className={styles.dec}>{item.dec}</div>
                        </Col>);
                    })
                }
            </Row>
        );
        return (
            <div>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Card title="负载情况" bordered={false}>
                            <Load setting={loadOptions} />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card title={serverListView} bordered={false}>
                            <Row style={{ padding: '16px' }}>
                                {serverMonitorView}
                                <Row>
                                    <Col span={20} style={{ padding: '15px', paddingBottom: '5px' }}>
                                        <Line ref={(line) => { this.lineRef = line; }} setting={lineOptions} />
                                    </Col>
                                    <Col span={4}>
                                        {serverLatencyView}
                                    </Col>
                                </Row>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="QPS实时情况" bordered={false}>
                            <Qps ref={(qps) => { this.qpsRef = qps; }} setting={qpsOptions}/>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={16}>
                        <Card title="流量实时情况" bordered={false}>
                            <Row>
                                <Row>
                                    <Col span={2} className={styles.kb}>
                                        <div>
                                            <div className="system-monitor-top-kbnum">
                                                <Icon type="arrow-up" />
                                                <span>{writeKb}</span>
                                            </div>
                                            <div>KB</div>
                                        </div>
                                        <Divider className="system-monitor-divider" />
                                        <div>
                                            <div className="system-monitor-bottom-kbnum">
                                                <Icon type="arrow-down" />
                                                <span>{readKb}</span>
                                            </div>
                                            <div>KB</div>
                                        </div>
                                    </Col>
                                    <Col span={20} style={{ paddingLeft: '20px' }}>
                                        <ThroughPut ref={(throughPut) => { this.throughPutRef = throughPut; }} setting={throughPutOptions}/>
                                    </Col>
                                </Row>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="热点服务TOP-20/1D" bordered={false}>
                            <Table
                                className={styles.table}
                                columns={hotServiceColumns}
                                dataSource={hotServiceData}
                                pagination={false}
                                scroll={{ y: 367 }}
                                showHeader={false}
                                locale={{ emptyText: '暂无数据' }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="错误服务TOP-10/1D" bordered={false}>
                            <Table
                                className={styles.table}
                                columns={errorServiceColumns}
                                dataSource={errorServiceData}
                                pagination={false}
                                scroll={{ y: 367 }}
                                showHeader={false}
                                locale={{ emptyText: '暂无数据' }}
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="线程池饱和度" bordered={false}>
                            <Table
                                className={styles.table}
                                columns={threadColumns}
                                dataSource={threadData}
                                pagination={false}
                                scroll={{ y: 367 }}
                                showHeader={false}
                                locale={{ emptyText: '线程池饱和度,没有对应接口获取数据，暂无数据' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Monitor;

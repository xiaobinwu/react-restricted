import React, { Component } from 'react';
import { Row, Col, Input, Form, Button, Table, Tooltip, Progress, Divider, Tag } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
import styles from './index.css';
const FormItem = Form.Item;

const waterfallWidth = 200;
class TraceInquire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: [],
            timestamps: '',
            maxDuration: '',
            startTime: '',
            traceId: ''
        };
        this.columns = [{
                title: '应用名',
                dataIndex: 'appName',
                key: 'appName',
            }, {
                title: '服务名',
                dataIndex: 'serviceName',
                key: 'serviceName',
                render: (value) => {
                    return (
                        <div title={value} className={styles.serviceName}>
                            {value}
                        </div>
                    )
                }
            }, {
                title: '方法名',
                dataIndex: 'methodName',
                key: 'methodName',
                width: 180,
                render: (value) => {
                    return (
                        <div title={value} className={styles.methodName}>
                            {value}
                        </div>
                    )
                }
        
            }, {
                title: '地址',
                dataIndex: 'ip',
                key: 'ip',
                width: 180
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 100
            }, {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 180
            }, {
                title: '耗时(ms)',
                dataIndex: 'duration',
                key: 'duration',
                width: 100
            }, {
                title: '时间轴',
                dataIndex: '',
                key: 'waterfall',
                width: waterfallWidth,
                render: (value, row) => {
                    let percent = 0;
                    let marginLeft = 0;
                    if (row.duration === this.state.maxDuration) {
                        percent = 100;
                        marginLeft = 0;
                    } else {
                        const currentTimestamps = new Date(row.timestamps);
                        const timestamps = new Date(this.state.timestamps);
                        marginLeft = (Math.abs(currentTimestamps.getTime() - timestamps.getTime()) / this.state.maxDuration) * (waterfallWidth - 32);
                        percent = (row.duration / this.state.maxDuration) * 100;
                    }
                    return(
                        <Tooltip placement="left" overlayClassName={styles.toolTip} title={() => {
                            return (
                                <div className={styles.toolTipContent}>
                                    <div><span>服务类型：</span><span>{row.type}</span></div>
                                    <div><span>应用名：</span><span>{row.appName}</span></div>
                                    <div><span>服务名：</span><span title={row.serviceName}>{row.serviceName}</span></div>
                                    <div><span>方法名：</span><span>{row.methodName}</span></div>
                                    <div><span>IP：</span><span>{row.ip}</span></div>
                                    <Divider />
                                    <div><span><Tag color="#e24d42">开始时间</Tag></span><span>{row.startTime}</span></div>
                                    <div><span><Tag color="#e24d42">调用时长</Tag></span><span>{row.duration}</span></div>
                                </div>
                            )
                        }}>
                            <div className={styles.waterfall}>
                                <Progress percent={percent} style={{marginLeft: marginLeft}} showInfo={false} />
                            </div>
                        </Tooltip>
                    )
                }
            }
        ];
    }
    componentDidMount() {
        this.getTraceData('5b0fc894e4b0da480de31339');
    }
    inquire = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.getTraceData(values.traceId.replace(/(^\s*)|(\s*$)/g, ''));
          }
        });
    }
    getTraceData = async (traceId) => {
        const { entry, code } = await linkTrackingService.getOneTrace({ traceId });
        if (code === '0' && entry.length > 0) {
            this.setState({
                entry,
                timestamps: entry[0].timestamps,
                maxDuration: entry[0].duration,
                traceId: entry[0].traceId,
                startTime: entry[0].startTime
            });
        }
    }

    getTitle = () => {
        const { traceId, startTime, maxDuration } = this.state;
        const title = traceId ?             
                    <div className={styles.title}>
                        <span>TraceId:  { traceId }</span>
                        <span>开始时间:  { startTime }</span>
                        <span>总耗时:  { maxDuration }ms</span>
                    </div> 
                : null;
        return title;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { entry } = this.state;
        const columns = this.columns;
        return (
            <div>
                <Form onSubmit={this.inquire}>
                    <Row gutter={16}>
                        <Col span={4}>
                            <FormItem>
                                {getFieldDecorator('traceId', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入traceId!' }],
                                })(
                                    <Input placeholder="输入traceId"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <FormItem>
                                <Button type="primary" icon="search" htmlType="submit">查询</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table 
                    key={`table-${entry.length > 0 && entry[0].key}`} 
                    columns={columns} 
                    childrenColumnName="childs" 
                    indentSize={10} 
                    defaultExpandAllRows={true}  
                    dataSource={entry} 
                    pagination={false} 
                    title={this.getTitle}
                />
            </div>
        );
    }
}

export default Form.create()(TraceInquire);

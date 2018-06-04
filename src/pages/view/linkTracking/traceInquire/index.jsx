import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Row, Col, Input, Form, Button, Table, Tooltip, Progress, Tag, message, Icon } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
import { getQueryString } from 'js/util';
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
            traceId: '',
            loading: false
        };
        this.columns = [{
                title: '应用名',
                dataIndex: 'appName',
                key: 'appName',
                render: this.handleAnnotations
            }, {
                title: '服务名',
                dataIndex: 'serviceName',
                key: 'serviceName',
                render: (value, row) => {
                    return (
                        <div title={value} className={styles.serviceName}>
                            {this.handleAnnotations(value, row)}
                        </div>
                    )
                }
            }, {
                title: '方法名',
                dataIndex: 'methodName',
                key: 'methodName',
                width: 180,
                render: (value, row) => {
                    return (
                        <div title={value} className={styles.methodName}>
                            {this.handleAnnotations(value, row)}
                        </div>
                    )
                }
        
            }, {
                title: '参数',
                dataIndex: 'value',
                key: 'value',
                width: 180,
                className: styles.paramColumn,
                render: (value, row) => {
                    return (
                        <CopyToClipboard text={value} onCopy={() => { message.success('参数复制成功！'); }}>
                            <div title={value} className={styles.value}>
                                {this.handleAnnotations(value, row, 'value')}
                            </div>
                        </CopyToClipboard>
                    )
                }
            }, {
                title: '地址',
                dataIndex: 'ip',
                key: 'ip',
                width: 180,
                render: this.handleAnnotations
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                render: this.handleAnnotations
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
                        marginLeft = (Math.abs(row.timestamps - this.state.timestamps) / this.state.maxDuration) * (waterfallWidth - 32);
                        const calculatePercent = (row.duration / this.state.maxDuration) * 100;
                        percent = row.duration === 0 ? 1 : (calculatePercent < 1 ? 1 : calculatePercent);
                    }
                    // 改变异常时的颜色，color.less
                    let annotationsClassName = row.annotations ? "system-annotations-tag" : "system-default-trace-tag";
                    let progressClassName = row.annotations ? "system-annotations-progress" : '';
                    annotationsClassName = `${annotationsClassName} ant-tag-has-color`;

                    return(
                        <Tooltip placement="left" overlayClassName={styles.toolTip} title={() => {
                            return (
                                <div className={styles.toolTipContent}>
                                    <div><span><Tag className={annotationsClassName}>开始时间</Tag></span><span>{row.startTime}</span></div>
                                    <div><span><Tag className={annotationsClassName}>结束时间</Tag></span><span>{row.endTime}</span></div>
                                    <div><span><Tag className={annotationsClassName}>调用时长</Tag></span><span>{row.duration}ms</span></div>
                                    {/* { row.annotations ? (<div><span><Tag className={annotationsClassName}>异常信息</Tag></span><span className={styles.annotations}>{row.annotations}</span></div>) : null } */}
                                </div>
                            )
                        }}>
                            <div className={styles.waterfall} style={{ width: waterfallWidth }}>
                                <Progress className={progressClassName} percent={percent} style={{marginLeft: marginLeft}} showInfo={false} />
                            </div>
                        </Tooltip>
                    )
                }
            }
        ];
    }
    componentDidMount() {
        const { traceId } = getQueryString();
        traceId && this.getTraceData(traceId);
        traceId  && this.props.form.setFieldsValue({ 'traceId': traceId });
    }
    // 处理异常
    handleAnnotations = (value, row, dataIndex) => {
        return row.annotations ? 
            <span className="system-annotations-text">
                { row.annotations && dataIndex === 'value' && value !== undefined ?
                    <Tooltip title={row.annotations}>
                        <Icon type="frown-o" style={{marginRight: "5px"}} /> 
                    </Tooltip>
                    : null 
                }
                {value}
            </span> 
            : value;
    }
    // 查询
    inquire = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.getTraceData(values.traceId.replace(/(^\s*)|(\s*$)/g, ''));
          }
        });
    }
    // 获取Trace数据
    getTraceData = async (traceId) => {
        this.setState({
            loading: true
        });
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
        this.setState({
            loading: false
        });
    }
    // 获取表格title
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
        const { entry, loading } = this.state;
        const columns = this.columns;
        return (
            <div className={styles.inquireTable}>
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
                    loading={loading} 
                />
            </div>
        );
    }
}

export default Form.create()(TraceInquire);

import React, { Component } from 'react';
import { Table, Button, Modal, message } from 'antd';
import gatewayService from 'service/gatewayService';

const { confirm } = Modal;
class GetwayConnect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        };
        this.columns = [{
            title: '连接IP',
            dataIndex: 'ip',
            key: 'ip'
        }, {
            title: '连接数',
            dataIndex: 'count',
            key: 'count'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => { // eslint-disable-line
                return (
                    <div>
                        <Button type="primary" size="small" style={{ marginRight: '10px' }} onClick={this.killConnect.bind(this, record.ip, record.key)}>断开连接</Button>
                        <Button type="primary" size="small" onClick={this.addBlackList.bind(this, record.ip, record.key)}>加入黑名单</Button>
                    </div>
                );
            }
        }];
    }
    componentDidMount() {
        this.getData();
    }
    // 获取数据
    getData = async () => {
        const data = await gatewayService.getConnectionInfoAll();
        data.forEach((item, index) => {
            item.key = index;
        });
        this.setState({
            loading: false,
            data
        });
    }
    // 断开连接
    killConnect = (ip, index) => {
        const that = this;
        confirm({
            title: '确认提示',
            content: <div><p>（KILL一个连接只是从服务端关闭掉，但是可再次连接）确认是否需要操作</p><p>{ip}</p></div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                (async () => {
                    const res = await gatewayService.killConnect({
                        clientIp: ip
                    });
                    if (res.code === 0) {
                        that.getData();
                        message.success(res.message);
                    }
                })();
            }
        });
    }
    // 加入黑名单
    addBlackList = (ip, index) => {
        const that = this;
        confirm({
            title: '确认提示',
            content: <div><p>（加入黑名单客户端不能再进行连接）确认是否需要操作</p><p>{ip}</p></div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                (async () => {
                    const res = await gatewayService.addBlackList({
                        clientIp: ip
                    });
                    if (res.code === 0) {
                        that.getData();
                        message.success(res.message);
                    }
                })();
            }
        });
    }
    render() {
        const {
            data,
            loading
        } = this.state;
        const columns = this.columns; // eslint-disable-line
        return (
            <div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            </div>
        );
    }
}

export default GetwayConnect;

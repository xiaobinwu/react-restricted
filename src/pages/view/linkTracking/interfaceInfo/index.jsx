import React, { Component } from 'react';
import { Row, Col, Switch } from 'antd';
import linkTrackingService from 'service/linkTrackingService';
import moment from 'moment';
import Interface from './charts/interface';
import QueryForm from '../queryForm';
import styles from './index.css';

class InterfaceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            extraParams: {
                col1: 'service.tps.5s.job',
                col2: 'GB',
                interval: '5s'
            }
        };
    }
    componentDidMount() {
        this.getInterfaceInfo();
    }
    // 获取分析数据
    getInterfaceInfo = async (e) => {
        e && e.preventDefault(); // eslint-disable-line
        const params = { ...this.interFaceRef.props.form.getFieldsValue(), ...this.state.extraParams };
        if (params.rangeTime && params.rangeTime.length > 0) {
            const { rangeTime } = params;
            params.startEventTime = rangeTime[0].format('YYYY-MM-DD HH:mm:ss');
            params.endEventTime = rangeTime[1].format('YYYY-MM-DD HH:mm:ss');
        }
        delete params.rangeTime;
        const res = await linkTrackingService.getInterfaceInfo(params);
        console.log(res);
    }
    render() {
        const baseFormItemsSetting = {
            app: {
                id: 'col3',
                options: {
                    initialValue: 'goods'
                }
            },
            service: {
                id: 'col4',
                options: {
                    initialValue: 'com.globalegrow.goods.spi.inter.ICategoryService'
                }
            },
            method: {
                id: 'col5',
                options: {
                    initialValue: 'getGoodsDefaultCategoryList'
                }
            },
            date: {
                options: {
                    initialValue: [moment('2018-06-14 11:43:25', 'YYYY-MM-DD HH:mm'), moment('2018-06-14 11:53:25', 'YYYY-MM-DD HH:mm')],
                }
            }
        };

        const extraFormItem = [
            {
                span: 3,
                label: '自动更新',
                id: 'autoRefresh',
                options: {
                    valuePropName: 'checked',
                    initialValue: true
                },
                className: styles.switch,
                component: <Switch />
            }
        ];

        return (
            <div>
                <QueryForm wrappedComponentRef={(ref) => { this.interFaceRef = ref; }} baseFormItemsSetting={baseFormItemsSetting} extraFormItem={extraFormItem} onSubmit={this.getInterfaceInfo} />
                <Row>
                    <Col>
                        <Interface />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default InterfaceInfo;

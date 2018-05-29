import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Icon, Row, Col, Button, Table  } from 'antd';
import Dynamic from 'charts/Dynamic';
import Nesting from 'charts/Nesting';
import Radar from 'charts/Radar';
import AreaSimple from 'charts/AreaSimple';
import Scatter from 'charts/Scatter';
import Map from 'charts/Map';
import styles from './index.css';

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }, {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
}];
class App extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
  };
  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }
  clearFilters = () => {
    this.setState({ filteredInfo: null });
  }
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  }
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  }
  render() {

    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
    }];

    return (
      <div styleName="App">
        <h1 styleName="title">应用概览</h1>
        <div styleName="overview"> 
            <div styleName="overview-container">
                <div styleName="overview-box">
                    <div styleName="overview-box-data">
                        <div styleName="overview-box-num">86,860</div>
                    </div>
                    <div styleName="overview-box-title">累计设备</div>
                </div>
                <div styleName="overview-box">
                    <div styleName="overview-box-data">
                        <div styleName="overview-box-num">0</div>
                        <div styleName="overview-equipment">
                            <Icon type="arrow-right" styleName="overview-sucess-icon" />
                            <span styleName="overview-equ">0.00%</span>
                        </div>
                    </div>
                    <div styleName="overview-box-title">可疑设备</div>
                </div>
                <div styleName="overview-box">
                    <div styleName="overview-box-data">
                        <div styleName="overview-box-num">6,274</div>
                        <div styleName="overview-equipment">
                            <Icon type="arrow-up" styleName="overview-sucess-icon" />
                            <span styleName="overview-equ">1.92%</span>
                        </div>
                    </div>
                    <div styleName="overview-box-title">近7日活跃设备</div>
                </div>
                <div styleName="overview-box">
                    <div styleName="overview-box-data">
                        <div styleName="overview-box-num">19,206</div>
                    </div>
                    <div styleName="overview-box-title">近30日活跃设备</div>
                </div>
                <div styleName="overview-box">
                    <div styleName="overview-box-data">
                        <div styleName="overview-box-num">00:04:09</div>
                        <div styleName="overview-equipment">
                            <Icon type="arrow-down" styleName="overview-error-icon" />
                            <span styleName="overview-equ">-1.26%</span>
                        </div>

                    </div>
                    <div styleName="overview-box-title">近7日单设备日均使用时长</div>
                </div>
            </div>
        </div>
        <h1 styleName="chart-title">实时性能监控</h1>
        <Dynamic/>
        <Row gutter={16} style={{ marginTop: '30px' }}>
            <Col span={12}>
                <h1 styleName="chart-title">访问来源分析</h1>
                <Nesting/>
            </Col>
            <Col span={12}>
              <h1 styleName="chart-title">资源投入分析</h1>
                <Radar/>
            </Col>
        </Row>
        <h1 styleName="chart-title">进度监控</h1>
        <AreaSimple />
        <h1 styleName="chart-title">雷达监控</h1>
        <Scatter />
        <h1 styleName="chart-title">地图</h1>
        <Map />
        <h1 styleName="chart-title">链路分析</h1>
        <div styleName="table">
          <Button onClick={this.setAgeSort}>Sort age</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </div>
        <Table columns={columns} dataSource={data} onChange={this.handleChange} />
      </div>
    );
  }
}

export default CSSModules(App, styles);
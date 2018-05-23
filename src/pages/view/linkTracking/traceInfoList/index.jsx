import React, { Component } from 'react';
import { Form, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class TraceInfoList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            application: '',
            service: '',
            method: '',
            proxy: '',
            time: ''
        };
    }

    getListData = () => {

    }

    handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    onChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    onOk = (value) => {
        console.log('onOk: ', value);
    }

    render() {
        return (
            <div>
                <Form layout="inline" onSubmit={this.getListData}>
                    <FormItem>
                        <Select name="application" onChange={this.handleChange}>
                            <Option value="">默认空</Option>
                            <Option value="0">mgoods</Option>
                            <Option value="1">promotion</Option>
                            <Option value="2">mpromotion</Option>
                            <Option value="3">mshop</Option>
                            <Option value="4">pay</Option>
                            <Option value="5">goods</Option>
                            <Option value="6">mstock</Option>
                            <Option value="7">mlogistics</Option>
                            <Option value="8">mmember</Option>
                            <Option value="9">member</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select name="service" onChange={this.handleChange}>
                            <Option value="">默认空</Option>
                            <Option value="0">com.globalegrow.mgoods.spi.inter.IPackageFeePersonConfigService</Option>
                            <Option value="1">com.globalegrow.spi.mgoods.common.inter.IGoodsPriceCalculateService</Option>
                            <Option value="2">com.globalegrow.mgoods.spi.inter.IPriceRuleConfigService</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select name="method" onChange={this.handleChange}>
                            <Option value="">默认空</Option>
                            <Option value="0">deletePackageFeePersonConfig</Option>
                            <Option value="1">batchInsertPackageConfig</Option>
                            <Option value="2">getPackageFeeConfigList</Option>
                            <Option value="3">getPackageFeePersonConfigList</Option>
                            <Option value="4">updatePackageFeePersonConfig</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Select name="proxy" onChange={this.handleChange}>
                            <option value="false" selected="selected">非代理层</option>
                            <option value="true">代理层</option>
                        </Select>
                    </FormItem>
                    <FormItem>
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['Start Time', 'End Time']}
                        onChange={this.onChange}
                        onOk={this.onOk}
                        />
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default TraceInfoList;
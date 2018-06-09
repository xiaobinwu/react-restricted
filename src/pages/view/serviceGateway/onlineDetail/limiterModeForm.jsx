import React, { Component } from 'react';
import { Select, Form } from 'antd';

const FormItem = Form.Item; // eslint-disable-line
const Option = Select.Option; // eslint-disable-line

const limitPolicyList = [
    {
        value: '0',
        label: '线程池隔离'
    },
    {
        value: '1',
        label: '令牌桶策略'
    },
    {
        value: '2',
        label: '信号量策略'
    }
];

class LimiterModeForm extends Component {
    render() {
        const {
            form,
            injectForm
        } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div>
                <Form layout="inline">
                    <FormItem>
                        {getFieldDecorator('limiterModeValue', {
                            initialValue: injectForm.limiterModeValue,
                        })(<Select placeholder="请选择限流策略" style={{ width: '252px' }}>
                            {
                                limitPolicyList.map((item, index) => { // eslint-disable-line
                                    return (<Option value={item.value} key={index}>{item.label}</Option>);
                                })
                            }
                        </Select>)}
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(LimiterModeForm);

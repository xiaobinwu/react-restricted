import React, { Component } from 'react';
import store from 'rRedux/store';
import logo from 'src/logo.png';
// import CSSModules from 'react-css-modules';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import userService from 'service/userService';

import particles from './particles';
import styles from './index.css';
// console.log(styles);

const FormItem = Form.Item;

class Auth extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { username, password } = values;
                const data = await userService.login({ username, password });
                if (data.code === '0') {
                    store.dispatch({
                        type: 'SET_LOGGED_USER',
                        logged: true,
                        username
                    });
                    this.props.history.replace('/');
                }
            }
        });
    }

    componentDidMount() {
        // 引入particles
        import('js/particles').then((particlesJS) => {
            particlesJS.default('particles-js', particles);
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        // debugger;
        return (
            <div>
                <div id='particles-js' className={styles['particles-js']}></div>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <img alt="logo" className={styles.img} src={logo} />
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            { getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }]
                            })(<Input className={styles.input} prefix={<Icon type="user" className={styles.icon} />} size="large" placeholder="Username" />)}

                        </FormItem>
                        <FormItem>
                            { getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }]
                            })(<Input className={styles.input} prefix={<Icon type="lock" className={styles.icon} />} size="large" type="password" placeholder="Password" />)}
                        </FormItem>
                        <FormItem>
                            { getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>记住我</Checkbox>)}
                            <a className={styles.forgot} href="">忘记密码？</a>
                            <Button type="primary" htmlType="submit" className={styles.button} size="large">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedAuthForm = Form.create()(Auth);

export default WrappedAuthForm;

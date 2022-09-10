import React from 'react';
import { observer } from 'mobx-react-lite';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import * as L from "../../logics/index";
import styles from '../../styles/index.module.scss';

export default class LoginForm extends React.Component<{}, {
    isLoggingIn: boolean,
    loginResult: { success: boolean, msg: string }
}>{
    constructor(props: {}) {
        super(props);

        this.state = {
            isLoggingIn: false,
            loginResult: {
                success: false,
                msg: ""
            }
        };
    }

    thisComponent = observer(() => (
        <Form
            name="normal_login"
            className={styles.formLogin}
            initialValues={{ remember: true }}
            onFinish={() => L.login(this)}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: "请输入登录账号"
                    },
                    {
                        min: 3,
                        message: "登录账号长度在3-10之间"
                    },
                    {
                        max: 10,
                        message: "登录账号长度在3-10之间"
                    },
                    {
                        pattern: /^[\da-zA-Z_-]+$/,
                        message: "登录名只能包含字母/数字/下划线和'-'"
                    }
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}
                    id="in-login-account"
                    placeholder="请输入登录账号" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: "请输入密码"
                    },
                    {
                        min: 5,
                        message: "密码长度在5-15之间"
                    },
                    {
                        max: 15,
                        message: "登录账号长度在5-15之间"
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    id="in-login-password"
                    placeholder="请输入登录密码"
                />
            </Form.Item>

            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox id="cb-remember">7日内自动登录</Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item
                validateStatus="error"
                help={this.state.loginResult.msg}
            >
                <Button className={styles.btnLogin}
                    type="primary" htmlType="submit" block
                    disabled={this.state.isLoggingIn}>
                    登录系统
                </Button>
            </Form.Item>
        </Form>
    ));

    render = () => (
        <this.thisComponent />
    );
}
import React, { useState} from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import * as L from "../../logics/index";
import * as RULES from "../../modules/form-rules";
import styles from '../../styles/index.module.scss';

const LoginForm: React.FC = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginResult, setLoginResult] = useState({
        success: false,
        msg: ""
    });

    return (
        <Form
            name="normal_login"
            className={styles.formLogin}
            initialValues={{ remember: true }}
            onFinish={() => L.login(setIsLoggingIn,setLoginResult)}
        >
            <Form.Item
                name="username"
                rules={RULES.ACCOUNT_RULES}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}
                    id="in-login-account"
                    placeholder="请输入登录账号" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={RULES.PW_RULES}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    id="in-login-password"
                    placeholder="请输入登录密码"
                />
            </Form.Item>

            <Form.Item>
                <Form.Item name="remember" noStyle>
                    <Checkbox id="cb-remember">7日内自动登录</Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item
                validateStatus="error"
                help={loginResult.msg}
            >
                <Button className={styles.btnLogin}
                    type="primary" htmlType="submit" block
                    disabled={isLoggingIn}>
                    登录系统
                </Button>
            </Form.Item>
        </Form>
    )
}

export default LoginForm;
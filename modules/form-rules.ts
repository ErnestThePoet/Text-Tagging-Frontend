import { Rule } from "antd/lib/form";

export const ACCOUNT_RULES: Rule[] = [
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
        message: "登录账号只能包含字母/数字/下划线和'-'"
    }
]

export const PW_RULES: Rule[] = [
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
        message: "密码长度在5-15之间"
    },
]
import axios from "axios";
import Router from "next/router";
import APIS from "../modules/apis";
import LoginForm from "../components/index/login-form";
import userData from "../states/user-data";
import { pbkdf2Hash } from "../modules/utils/hash";

export const tryAutoLogin = () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId !== null&&sessionId.length>25) {
        axios.postForm(APIS.autoLogin, { sessionId })
            .then(res => {
                if (res.data.success) {
                    userData.setAccount(res.data.userData.account);
                    userData.setName(res.data.userData.name);
                    userData.setLevel(res.data.userData.level);
                    userData.setAccessId(res.data.accessId);
                    userData.setIsLoggedIn(true);
            }
        })
    }
}

export const login = (ctx: LoginForm) => {
    const account
        = (<HTMLInputElement>document.getElementById("in-login-account")).value;
    
    const password
        = (<HTMLInputElement>document.getElementById("in-login-password")).value;
    
    const remember = (<HTMLInputElement>document.getElementById("cb-remember")).checked;
    
    ctx.setState({
        isLoggingIn: true
    });
    
    axios.postForm(APIS.login, {
        account,
        pwHashed: pbkdf2Hash(password),
        remember
    }).then(res => {
        if (res.data.success) {
            userData.setAccount(res.data.userData.account);
            userData.setName(res.data.userData.name);
            userData.setLevel(res.data.userData.level);
            userData.setAccessId(res.data.accessId);
            userData.setIsLoggedIn(true);

            if (remember) {
                localStorage.setItem("sessionId", res.data.sessionId);
            }

            ctx.setState({
                loginResult: {
                    success: true,
                    msg: ""
                }
            });
        }
        else {
            ctx.setState({
                loginResult: {
                    success: false,
                    msg: res.data.msg
                }
            });
        }
    }).catch(reason => console.log(reason))
        .finally(() => ctx.setState({
            isLoggingIn: false
        }));
}

export const enterSystem = () => {
    Router.push("/workspace/tagging");
}
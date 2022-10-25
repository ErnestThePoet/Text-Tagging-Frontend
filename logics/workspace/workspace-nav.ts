import { message } from "antd";
import axios from "axios";
import Router from "next/router";
import APIS from "../../modules/apis";
import { pbkdf2Hash } from "../../modules/utils/hash";
import changePwDialogState from "../../states/component-states/change-pw-dialog-state";
import userData from "../../states/user-data";

export const onNavMenuItemClick = (key: string) => {
    let targetPath: string = "";
    switch (key) {
        case "0":
            targetPath = "/workspace/tagging";
            break;
        case "1":
            targetPath = "/workspace/add-texts";
            break;
        case "2":
            targetPath = "/workspace/query";
            break;
        case "3":
            targetPath = "/workspace/management";
            break;
    }

    if (Router.pathname !== targetPath) {
        Router.push(targetPath);
    }
}

export const onAccountMenuItemClick = (key:string) => {
    switch (key) {
        // case "0":
        //     //TODO:add guide
        //     break;
        case "1":
            changePwDialogState.setIsOpen(true);
            break;
        case "2":
            logout();
            break;
    }
}

const logout = () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId !== null && sessionId.length > 25) {
        axios.postForm(APIS.logout, { sessionId });
    }

    localStorage.removeItem("sessionId");

    userData.clear();

    Router.replace("/");
}

export const changePw = () => {
    if (changePwDialogState.newPw !== changePwDialogState.newPwConfirm) {
        return;
    }

    changePwDialogState.setIsConfirmLoading(true);

    axios.postForm(APIS.changePw, {
        account: userData.account,
        pwHashed: pbkdf2Hash(changePwDialogState.oldPw),
        newPwHashed:pbkdf2Hash(changePwDialogState.newPw)
    }).then(res => {
        if (res.data.success) {
            message.success("修改密码成功，请重新登陆");
            changePwDialogState.setIsOpen(false);
            changePwDialogState.setResultMsg("");
            logout();
        }
        else {
            changePwDialogState.setResultMsg(res.data.msg);
        }
    }).catch(reason => {
        console.log(reason);
        message.error(reason.message);
    }).finally(() => {
        changePwDialogState.setIsConfirmLoading(false);
    });
}
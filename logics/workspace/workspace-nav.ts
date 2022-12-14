import { message } from "antd";
import axios from "axios";
import Router from "next/router";
import APIS from "../../modules/apis";
import { pbkdf2Hash } from "../../modules/utils/hash";
import addTextsData from "../../states/add-texts-data";
import changePwDialogState from "../../states/component-states/change-pw-dialog-state";
import taggingData from "../../states/tagging-data";
import userData from "../../states/user-data";

export const onNavMenuItemClick = (key: string) => {
    let targetPath: string = "";
    switch (key) {
        case "0":
            targetPath = "/workspace/tagging";
            break;
        case "1":
            targetPath = "/workspace/add-texts";
            addTextsData.updateTextUserIdBaseIndex();
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

export const logout = () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId !== null && sessionId.length > 25) {
        axios.postForm(APIS.logout, { sessionId });
    }

    localStorage.removeItem("sessionId");

    taggingData.setNoUnsavedChanges();

    window.top?.location.replace("/");
}

export const changePw = () => {
    if (changePwDialogState.newPw !== changePwDialogState.newPwConfirm) {
        return;
    }

    if (changePwDialogState.oldPw === changePwDialogState.newPw) {
        changePwDialogState.setResultMsg("新密码和旧密码不能相同");
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
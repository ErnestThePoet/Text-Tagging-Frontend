import { makeAutoObservable } from "mobx";
import axios from "axios";
import APIS from "../modules/apis";
import { message } from "antd";
import { UserLevel } from "../modules/objects/types";
import uiState from "./ui-state";
import userData from "./user-data";

export interface UserInfo{
    account: string;
    name: string;
    level: UserLevel;
    lastLoginTime: string | null;
}

class UserManegementData{
    constructor() {
        makeAutoObservable(this);
    }
    
    usersInfo: UserInfo[] = [];

    setUsersInfo(value: UserInfo[]) {
        this.usersInfo = value;
    }

    addUser(account: string, name: string, level: UserLevel) {
        this.usersInfo.push({
            account,
            name,
            level,
            lastLoginTime:null
        });
    }

    removeUsers(indexes: number[]) {
        const indexesCopied = [...indexes];
        indexesCopied.sort((a, b) => b - a);
        for (const i in indexesCopied) {
            this.usersInfo.splice(indexesCopied[i], 1);
        }
    }

    changeUserLevel(index: number, level: UserLevel) {
        this.usersInfo[index].level = level;
    }

    updateUsersInfo() {
        if (!userData.isAdmin) {
            return;
        }

        uiState.setIsUsersInfoLoading(true);

        axios.postForm(APIS.getUsersInfo, {
            accessId: userData.accessId
        }).then(res => {
            if (res.data.success) {
                this.setUsersInfo(res.data.usersInfo);
            }
            else {
                message.error(res.data.msg);
            }
        }).catch(reason => {
            console.log(reason);
            message.error(reason.message);
        }).finally(() => {
            uiState.setIsUsersInfoLoading(false);
        });
    }
}

export default new UserManegementData();
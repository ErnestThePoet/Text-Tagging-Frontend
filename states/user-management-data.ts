import { makeAutoObservable } from "mobx";
import { UserLevel } from "../modules/objects/types";

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
}

export default new UserManegementData();
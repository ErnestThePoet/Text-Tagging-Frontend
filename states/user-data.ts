import { makeAutoObservable } from "mobx";
import type { UserLevel } from "../modules/objects/types";

class UserData{
    constructor() {
        makeAutoObservable(this);
    }

    isLoggedIn: boolean = false;

    account: string = "";
    name: string = "";
    // 无任何权限
    level: UserLevel = -1;

    accessId: string = "";

    setIsLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn;
    }

    setAccount(account: string) {
        this.account = account;
    }

    setName(name: string) {
        this.name = name;
    }

    setLevel(level: UserLevel) {
        this.level = level;
    }

    setAccessId(accessId: string) {
        this.accessId = accessId;
    }

    clear() {
        this.isLoggedIn = false;
        this.account = "";
        this.name = "";
        this.level = -1;
        this.accessId = "";
    }

    get isAdmin():boolean {
        return this.isLoggedIn && this.level === 1;
    }
}

export default new UserData();
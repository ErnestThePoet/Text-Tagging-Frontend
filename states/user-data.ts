import { makeAutoObservable } from "mobx";

class UserData{
    constructor() {
        makeAutoObservable(this);
    }

    isLoggedIn: boolean = false;

    account: string = "";
    name: string = "";
    level: number = -1;

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

    setLevel(level: number) {
        this.level = level;
    }

    setAccessId(accessId: string) {
        this.accessId = accessId;
    }

    get isAdmin():boolean {
        return this.isLoggedIn && this.level === 1;
    }
}

export default new UserData();
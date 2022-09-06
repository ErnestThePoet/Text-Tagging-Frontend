import { makeAutoObservable } from "mobx";

class UserData{
    constructor() {
        makeAutoObservable(this);
    }

    account: string = "";
    name: string = "";
    level: number = -1;

    accessId: string = "";

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

    get isLoggedInAndAdmin():boolean {
        return this.accessId !== ""
            && this.level === 1;
    }
}

export default new UserData();
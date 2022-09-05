import { makeAutoObservable } from "mobx";

class UserData{
    constructor() {
        makeAutoObservable(this);
    }

    account: string = "";
    name: string = "";
    level: number = -1;

    setAccount(account: string) {
        this.account = account;
    }

    setName(name: string) {
        this.name = name;
    }

    setLevel(level: number) {
        this.level = level;
    }

    get isAdmin():boolean {
        return this.level === 1;
    }
}

export default new UserData();
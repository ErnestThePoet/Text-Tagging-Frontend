import { makeAutoObservable } from "mobx";
import { UserLevel } from "../../modules/objects/types";

class AddUserDialogState {
    constructor() {
        makeAutoObservable(this);
    }
    
    isOpen: boolean = false;
    setIsOpen(value: boolean) {
        this.isOpen = value;
    }

    isConfirmLoading: boolean = false;
    setIsConfirmLoading(value: boolean) {
        this.isConfirmLoading = value;
    }

    name: string = "";
    setName(value: string) {
        this.name = value;
    }
    
    account: string = "";
    setAccount(value: string) {
        this.account = value;
    }
    
    level: UserLevel = 0;
    setLevel(value: UserLevel) {
        this.level = value;
    }

    resultMsg: string = "";
    setResultMsg(value: string) {
        this.resultMsg = value;
    }
}

export default new AddUserDialogState();
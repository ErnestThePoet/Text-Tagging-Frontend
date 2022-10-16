import { makeAutoObservable } from "mobx";

class ChangePwDialogState{
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

    oldPw: string = "";
    setOldPw(value: string) {
        this.oldPw = value;
    }

    newPw: string = "";
    setNewPw(value: string) {
        this.newPw = value;
        if (this.newPw !== this.newPwConfirm) {
            this.resultMsg = "两次输入的新密码不一致";
        }
        else {
            this.resultMsg = "";
        }
    }

    newPwConfirm: string = "";
    setNewPwConfirm(value: string) {
        this.newPwConfirm = value;
        if (this.newPw !== this.newPwConfirm) {
            this.resultMsg = "两次输入的新密码不一致";
        }
        else {
            this.resultMsg = "";
        }
    }

    resultMsg: string = "";
    setResultMsg(value: string) {
        this.resultMsg = value;
    }
}

export default new ChangePwDialogState();
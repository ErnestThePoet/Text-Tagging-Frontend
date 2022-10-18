import { makeAutoObservable } from "mobx";

class GetTextsDialogState {
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

    targetTextCount: number = 30;
    setTargetTextCount(value: number) {
        this.targetTextCount = value;
    }


    targetFile: string = "";
    setTargetFile(value: string) {
        this.targetFile = value;
    }

    moreTagsFirst: boolean = false;
    setIsMoreTagsFirst(value: boolean) {
        this.moreTagsFirst = value;
    }
}

export default new GetTextsDialogState();
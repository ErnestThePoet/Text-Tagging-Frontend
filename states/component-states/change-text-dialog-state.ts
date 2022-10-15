import { makeAutoObservable } from "mobx";

class ChangeTextDialogState {
    constructor() {
        makeAutoObservable(this);
    }

    selectedTextIndex: number = 0;
    setSelectedTextIndex(value: number) {
        this.selectedTextIndex = value;
    }

    isChangeTextDialogOpen: boolean = false;
    setIsChangeTextDialogOpen(value: boolean) {
        this.isChangeTextDialogOpen = value;
    }

    isChangeTextLoading: boolean = false;
    setIsChangeTextLoading(value: boolean) {
        this.isChangeTextLoading = value;
    }

    text: string = "";
    setText(value: string) {
        this.text = value;
    }
}

export default new ChangeTextDialogState();
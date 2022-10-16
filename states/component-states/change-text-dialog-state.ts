import { makeAutoObservable } from "mobx";

class ChangeTextDialogState {
    constructor() {
        makeAutoObservable(this);
    }

    selectedTextIndex: number = 0;
    setSelectedTextIndex(value: number) {
        this.selectedTextIndex = value;
    }

    isOpen: boolean = false;
    setIsOpen(value: boolean) {
        this.isOpen = value;
    }

    isConfirmLoading: boolean = false;
    setIsConfirmLoading(value: boolean) {
        this.isConfirmLoading = value;
    }

    text: string = "";
    setText(value: string) {
        this.text = value;
    }
}

export default new ChangeTextDialogState();
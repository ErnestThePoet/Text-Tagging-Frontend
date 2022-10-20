import { makeAutoObservable } from "mobx";

class ChangeTextDialogState {
    constructor() {
        makeAutoObservable(this);
    }

    // 在文本标注中修改文本则为taggingData.texts的下标，
    // 在文本查询中修改文本则为queryData.texts的下标
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
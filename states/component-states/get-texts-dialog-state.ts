import { makeAutoObservable } from "mobx";

class GetTextsDialogState {
    constructor() {
        makeAutoObservable(this);
    }

    isGetTextsDialogOpen: boolean = false;
    setIsGetTextsDialogOpen(value: boolean) {
        this.isGetTextsDialogOpen = value;
    }

    isDatasetStatLoading: boolean = false;
    setIsDatasetStatLoading(value: boolean) {
        this.isDatasetStatLoading = value;
    }

    isGetTextsLoading: boolean = false;
    setIsGetTextsLoading(value: boolean) {
        this.isGetTextsLoading = value;
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
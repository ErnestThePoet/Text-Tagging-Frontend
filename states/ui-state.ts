import { makeAutoObservable } from "mobx";

class UiState{
    constructor() {
        makeAutoObservable(this);
    }

    isDatasetStatLoading: boolean = false;
    setIsDatasetStatLoading(value: boolean) {
        this.isDatasetStatLoading = value;
    }

    isUsersInfoLoading: boolean = false;
    setIsUsersInfoLoading(value: boolean) {
        this.isUsersInfoLoading = value;
    }

    isImportDatasetLoading: boolean = false;
    setIsImportDatasetLoading(value: boolean) {
        this.isImportDatasetLoading = value;
    }
}

export default new UiState();
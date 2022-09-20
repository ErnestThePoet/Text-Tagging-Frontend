import { makeAutoObservable } from "mobx";

interface ManagementLoadings{
    datasetStat: boolean;
}

interface Loadings{
    management: ManagementLoadings;
}

class Ui{
    constructor() {
        makeAutoObservable(this);
    }

    loadings: Loadings = {
        management: {
            datasetStat: false
        }
    }

    setManagementLoadings(loadings: Partial<ManagementLoadings>) {
        Object.assign(this.loadings.management, loadings);
    }
}

export default new Ui();
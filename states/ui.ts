import { makeAutoObservable } from "mobx";

// interface ManagementLoadings{
//     dataset: boolean;
// }

// interface Loadings{
//     management: ManagementLoadings;
// }

class Ui{
    constructor() {
        makeAutoObservable(this);
    }

    // loadings: Loadings = {
    //     management: {
    //         dataset: false
    //     }
    // }

    // setManagementLoadings(loadings: Partial<ManagementLoadings>) {
    //     Object.assign(this.loadings.management, loadings);
    // }
}

export default new Ui();
type DemandIndex = 0 | 1;

class CloseEventManager{
    constructor() {}

    private alertDemands: boolean[] = [false,false];

    private handler = e => {
        e.preventDefault();
        return e.returnValue = "确定离开吗？所有未提交的更改都会丢失。";
    };

    setAlert(demandIndex: DemandIndex) {
        if (this.alertDemands[demandIndex]) {
            return;
        }

        if (this.alertDemands.every(x=>!x)) {
            window.addEventListener("beforeunload", this.handler);
        }

        this.alertDemands[demandIndex] = true;
    }

    removeAlert(demandIndex: DemandIndex) {
        if (!this.alertDemands[demandIndex]) {
            return;
        }

        this.alertDemands[demandIndex] = false;

        if (this.alertDemands.every(x => !x)) {
            window.removeEventListener("beforeunload", this.handler);
        }
    }
}

export default new CloseEventManager();
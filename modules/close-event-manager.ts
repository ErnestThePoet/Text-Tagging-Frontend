class CloseEventManager{
    constructor() {}

    private shouldAlert: boolean = false;

    private handler = e => {
        e.preventDefault();
        return e.returnValue = "确定离开吗？所有未提交的更改都会丢失。";
    };

    setAlert() {
        if (this.shouldAlert) {
            return;
        }

        window.addEventListener("beforeunload", this.handler);
        this.shouldAlert = true;
    }

    removeAlert() {
        if (!this.shouldAlert) {
            return;
        }

        window.removeEventListener("beforeunload", this.handler);
        this.shouldAlert = false;
    }
}

export default new CloseEventManager();
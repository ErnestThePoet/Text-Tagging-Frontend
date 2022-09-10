import { makeAutoObservable } from "mobx";

class TagData{
    constructor() {
        makeAutoObservable(this);
    }

    taskId: number = 1;

    setTaskId(taskId: number) {
        this.taskId = taskId;
    }
}

export default new TagData();
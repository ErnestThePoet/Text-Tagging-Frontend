import { makeAutoObservable } from "mobx";
import axios from "axios";
import APIS from "../modules/apis";
import userData from "./user-data";
import taskData from "./task-data";
import { message } from "antd";

interface AddedText{
    userId: string;
    fileName: string;
    text: string;
}

class AddTextsData{
    constructor() {
        makeAutoObservable(this, {
            getTextUserId:false,
            getTextPreview: false,
            isTextValid: false,
            isUserIdValid: false,
            isValid:false
        });
    }

    texts: AddedText[] = [];

    textUserIdBaseIndex: number = 1;
    textUserIdPrefix: string = "";

    setTextUserIdBaseIndex(textUserIdBaseIndex: number) {
        this.textUserIdBaseIndex = Math.floor(textUserIdBaseIndex);
    }
    
    setTextUserIdPrefix(textUserIdPrefix: string) {
        this.textUserIdPrefix = textUserIdPrefix;
    }

    add() {
        this.texts.push({
            userId: this.getTextUserId(this.texts.length),
            fileName:"自添加文本",
            text:""
        });
    }

    changeText(index:number,text: string) {
        this.texts[index].text=text;
    }

    changeUserId(index: number, userId: string) {
        this.texts[index].userId = userId;
    }

    remove(index: number) {
        this.texts.splice(index, 1);
        // 更新删除文本后方文本的用户ID，但只更新用户没有手动修改过的
        for (let i = index; i < this.texts.length; i++){
            if (this.texts[i].userId === this.getTextUserId(i + 1)) {
                this.texts[i].userId = this.getTextUserId(i);
            }
        }
    }

    clear() {
        this.texts = [];
    }

    updateTextUserIdBaseIndex() {
        axios.postForm(APIS.getAddedTextCount, {
            accessId: userData.accessId,
            taskId: taskData.taskId
        }).then(res => {
            if (res.data.success) {
                this.textUserIdBaseIndex = res.data.count + 1;
            }
            else {
                message.error("获取自添加文本数量失败：" + res.data.msg);
            }
        }).catch(reason => {
            message.error("获取自添加文本数量失败：" + reason);
            console.log(reason);
        });
    }

    getTextUserId(indexOffset: number) {
        return `${this.textUserIdPrefix}${this.textUserIdBaseIndex + indexOffset}`;
    }

    getTextPreview(textIndex: number, length: number = 10): string {
        if (this.texts[textIndex].text.length <= length) {
            return this.texts[textIndex].text;
        }

        return this.texts[textIndex].text.slice(0, length) + "..";
    }
    
    isTextValid(index: number) {
        return this.texts[index].text.length > 0;
    }

    isUserIdValid(index: number) {
        return this.texts[index].userId.length > 0;
    }

    isValid(index: number) {
        return this.isUserIdValid(index) && this.isTextValid(index);
    }
}

export default new AddTextsData();
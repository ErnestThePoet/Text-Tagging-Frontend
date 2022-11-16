import { makeAutoObservable } from "mobx";

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

    textUserIdPrefix: string = "";

    setTextUserIdPrefix(textUserIdPrefix: string) {
        this.textUserIdPrefix = textUserIdPrefix;
    }

    getTextUserId(index: number|string) {
        return `${this.textUserIdPrefix}${index}`;
    }

    add() {
        this.texts.push({
            userId: this.getTextUserId(this.texts.length + 1),
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
            if (this.texts[i].userId === this.getTextUserId(i + 2)) {
                this.texts[i].userId = this.getTextUserId(i + 1);
            }
        }
    }

    clear() {
        this.texts = [];
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
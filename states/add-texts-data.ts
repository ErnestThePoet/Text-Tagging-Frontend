import { makeAutoObservable } from "mobx";

interface AddedText{
    userId: string;
    text: string;
}

class AddTextsData{
    constructor() {
        makeAutoObservable(this, {
            getTextPreview: false,
            isTextValid: false,
            isUserIdValid: false,
            isValid:false
        });
    }

    texts: AddedText[] = [];

    add() {
        this.texts.push({
            userId: (this.texts.length+1).toString(),
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
            if (this.texts[i].userId === (i + 2).toString()) {
                this.texts[i].userId = (i + 1).toString();
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
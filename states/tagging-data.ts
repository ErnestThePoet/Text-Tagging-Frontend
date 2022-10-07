import { makeAutoObservable } from "mobx";
import type { Text } from "../modules/objects/text";
import userData from "./user-data";
import { getCurrentDateTimeStr } from "../modules/utils/date-time";
import type { CheckResult } from "./task-data";
import taskData from "./task-data";

class TaggingData{
    constructor() {
        makeAutoObservable(this, {
            validateTagItem:false,
            isTextTagged: false,
            getTextPreview: false
        });
    }
    
    texts: Array<Text> = [];

    hasUnsavedChanges: boolean = false;

    get taggedTextCount(): number{
        return this.texts.filter((_,i) => this.isTextTagged(i)).length;
    }

    // 验证标注项是否合法，注意标注项为空是合法的
    validateTagItem(textIndex: number, tagItemIndex: number|string): CheckResult{
        const validation = taskData.taggingValidations.find(
            x => x.id === this.texts[textIndex].tag.tagItems[tagItemIndex].id)!;

        return validation.valueCheck(
            this.texts[textIndex].tag.tagItems[tagItemIndex].value
        );
    }

    // 判定规则：有任意一项为空或验证失败则认为未标注完成
    isTextTagged(textIndex: number):boolean {
        for (const i in this.texts[textIndex].tag.tagItems) {
            if (this.texts[textIndex].tag.tagItems[i].value.length === 0
                || !this.validateTagItem(textIndex, i).ok) {
                return false;
            }
        }

        return true;
    }

    getTextPreview(textIndex: number,length: number = 10): string {
        if (this.texts[textIndex].text.length <= length) {
            return this.texts[textIndex].text;
        }

        return this.texts[textIndex].text.slice(0, length) + "..";
    }

    setTexts(texts: Array<Text>) {
        this.texts = texts;
    }

    changeTag(textIndex: number, tagItemIndex: number, value: string[]) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value = value;
        this.texts[textIndex].tag.tagTime = getCurrentDateTimeStr();
        this.texts[textIndex].tag.taggerName = userData.name;

        this.hasUnsavedChanges = true;
    }

    setNoUnsavedChanges() {
        this.hasUnsavedChanges = false;
    }
}

export default new TaggingData();
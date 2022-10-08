import { makeAutoObservable } from "mobx";
import type { Text } from "../modules/objects/text";
import userData from "./user-data";
import { getCurrentDateTimeStr } from "../modules/utils/date-time";
import type { CheckResult } from "./task-data";
import taskData from "./task-data";

type TagStatus = "FINISHED" | "UNFINISHED" | "ERROR";
interface TagItemStatus{
    status: TagStatus;
    msg: string;
}

class TaggingData{
    constructor() {
        makeAutoObservable(this, {
            validateTagItem:false,
            getTagItemStatus: false,
            getTextTagStatus:false,
            getTextPreview: false
        });
    }
    
    texts: Array<Text> = [];

    hasUnsavedChanges: boolean = false;

    get taggedTextCount(): number{
        return this.texts.filter((_,i) => this.getTextTagStatus(i)==="FINISHED").length;
    }

    // 验证标注项是否合法，注意标注项为空是合法的
    validateTagItem(textIndex: number|string, tagItemIndex: number|string): CheckResult{
        const validation = taskData.idTaggingValidationMap[
            this.texts[textIndex].tag.tagItems[tagItemIndex].id
        ];

        return validation.valueCheck(
            this.texts[textIndex].tag.tagItems[tagItemIndex].value
        );
    }

    // 判定规则：验证失败则返回校验失败；
    // 否则若为空则返回标注未完成（单输入、多输入的空字符串均不算入）；
    // 否则返回标注完成
    getTagItemStatus(textIndex: number|string, tagItemIndex: number|string): TagItemStatus{
        const validationResult = this.validateTagItem(textIndex, tagItemIndex);
        // 验证失败
        if (!validationResult.ok) {
            return {
                status: "ERROR",
                msg: validationResult.msg
            };
        }

        const currentTagItem = this.texts[textIndex].tag.tagItems[tagItemIndex];
        const currentTagItemMeta = taskData.idMetaMap[currentTagItem.id];
        // 单选，多选为空
        if ((currentTagItemMeta.type === 0 || currentTagItemMeta.type === 1)
            && currentTagItem.value.length === 0) {
            return {
                status: "UNFINISHED",
                msg: ""
            };
        }

        // 单输入，多输入非空串元素为空
        if ((currentTagItemMeta.type === 2 || currentTagItemMeta.type === 3)
            && currentTagItem.value.filter(x => x !== "").length === 0) {
            return {
                status: "UNFINISHED",
                msg: ""
            };
        }

        return {
            status: "FINISHED",
            msg: ""
        };
    }

    // 判定规则：有任意一项验证失败则返回校验失败；
    // 否则任意一项为空则返回标注未完成（单输入、多输入的空字符串均不算入）；
    // 否则返回标注完成
    getTextTagStatus(textIndex: number|string): TagStatus {
        const tagItemStatuses = this.texts[textIndex].tag.tagItems.map(
            (_, i) => this.getTagItemStatus(textIndex, i)
        );

        if (tagItemStatuses.some(x=>x.status==="ERROR")) {
            return "ERROR";
        }
        else if (tagItemStatuses.some(x=>x.status==="UNFINISHED")) {
            return "UNFINISHED";
        }

        return "FINISHED";
    }

    getTextPreview(textIndex: number,length: number = 9): string {
        if (this.texts[textIndex].text.length <= length) {
            return this.texts[textIndex].text;
        }

        return this.texts[textIndex].text.slice(0, length) + "..";
    }

    setTexts(texts: Array<Text>) {
        this.texts = texts;
    }

    private markTagChange(textIndex: number) {
        this.texts[textIndex].tag.tagTime = getCurrentDateTimeStr();
        this.texts[textIndex].tag.taggerName = userData.name;

        this.hasUnsavedChanges = true;
    }

    setTagItemValue(textIndex: number, tagItemIndex: number, value: string[]) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value = value;
        this.markTagChange(textIndex);
    }

    setTagItemValueElement(textIndex: number, tagItemIndex: number,
        elementIndex: number, element: string) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value[elementIndex]=element;
        this.markTagChange(textIndex);
    }

    addTagItemValueElement(textIndex: number, tagItemIndex: number, element: string) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value.push(element);
        this.markTagChange(textIndex);
    }

    removeTagItemValueElement(textIndex: number, tagItemIndex: number, elementIndex: number) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value.splice(elementIndex, 1);
        this.markTagChange(textIndex);
    }

    setNoUnsavedChanges() {
        this.hasUnsavedChanges = false;
    }
}

export default new TaggingData();
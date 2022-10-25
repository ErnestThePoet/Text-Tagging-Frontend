import { makeAutoObservable } from "mobx";
import type { Text } from "../modules/objects/text";
import userData from "./user-data";
import { getCurrentDateTimeStr } from "../modules/utils/date-time";
import type { CheckResult } from "./task-data";
import taskData from "./task-data";
import closeEventManager from "../modules/close-event-manager";
import { fetchInputSuggestions } from "../modules/input-suggestions";

type TagStatus = "FINISHED" | "UNFINISHED" | "ERROR";
interface TagItemStatus{
    status: TagStatus;
    msg: string;
}

// 每条文本都有一个此类型的对象
export interface InputSuggestion{
    [id: number]: Array<{ value: string }>;
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
    suggestions: Array<InputSuggestion> = [];

    hasUnsavedChanges: boolean = false;

    get taggedTextCount(): number{
        return this.texts.filter((_,i) => this.getTextTagStatus(i)==="FINISHED").length;
    }

    get taggingProgressPercent(): number{
        return (this.taggedTextCount
            / this.texts.length) * 100
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
    getTextTagStatus(textIndex: number | string): TagStatus {
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
        this.setHasUnsavedChanges();

        this.suggestions = new Array(this.texts.length).fill({});
        
        fetchInputSuggestions();
    }
    
    setSingleSuggestion(index: number, suggestion: InputSuggestion) {
        this.suggestions[index] = suggestion;
    }

    // 仅在修改标注对话框使用
    pushText(text: Text) {
        this.texts.push(text);
    }

    popText() {
        this.texts.pop();
    }

    // 修改文本
    changeText(index: number, newText: string) {
        this.texts[index].text = newText;
    }

    setNoUnsavedChanges() {
        this.hasUnsavedChanges = false;
        closeEventManager.removeAlert();
    }

    private setHasUnsavedChanges() {
        this.hasUnsavedChanges = true;
        closeEventManager.setAlert();
    }

    private markTagChange(textIndex: number) {
        this.texts[textIndex].tag.tagTime = getCurrentDateTimeStr();
        this.texts[textIndex].tag.taggerName = userData.name;

        this.setHasUnsavedChanges();
    }

    // 设置标注项的整个值
    setTagItemValue(textIndex: number, tagItemIndex: number, value: string[]) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value = value;
        this.markTagChange(textIndex);
    }

    // 设置标注项某个元素的值
    setTagItemValueElement(textIndex: number, tagItemIndex: number,
        elementIndex: number, element: string) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value[elementIndex]=element;
        this.markTagChange(textIndex);
    }

    // 向标注项值添加一个元素
    addTagItemValueElement(textIndex: number, tagItemIndex: number, element: string) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value.push(element);
        this.markTagChange(textIndex);
    }

    // 从标注项值中删除一个元素
    removeTagItemValueElement(textIndex: number, tagItemIndex: number, elementIndex: number) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value.splice(elementIndex, 1);
        this.markTagChange(textIndex);
    }
}

export default new TaggingData();
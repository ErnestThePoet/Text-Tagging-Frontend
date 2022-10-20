import { makeAutoObservable } from "mobx";
import type { Text, TagItem, Tag } from "../modules/objects/text";
import moment from "moment";
import type { Moment } from 'moment';
import {
    MOMENT_DATE_FORMAT,
    MOMENT_TIME_FORMAT,
    MOMENT_DATETIME_FORMAT
} from "../modules/utils/date-time";

type TagStatus = 0 | 1 | 2;

class QueryData{
    constructor() {
        makeAutoObservable(this);
    }
    
    texts: Array<Text> = [];

    setTexts(texts: Array<Text>) {
        this.texts = texts;
    }

    changeTagTextIndex: number = 0;
    setChangeTagTextIndex(value: number) {
        this.changeTagTextIndex = value;
    }

    fileNames: string[] = [];
    setFileNames(value: string[]) {
        this.fileNames = value;
    }

    tagStatus: TagStatus = 0;
    setTagStatus(value: TagStatus) {
        this.tagStatus = value;
    }

    textPart: string = "";
    setTextPart(value: string) {
        this.textPart = value;
    }

    taggerNames: string[] = [];
    setTaggerNames(value: string[]) {
        this.taggerNames = value;
    }

    shouldFilterTagTime: boolean = false;
    setShouldFilterTagTime(value: boolean) {
        this.shouldFilterTagTime = value;
    }

    tagTimeStartDate: Moment = moment();
    setTagTimeStartDate(value: Moment) {
        this.tagTimeStartDate = value;
    }

    tagTimeStartTime: Moment = moment();
    setTagTimeStartTime(value: Moment) {
        this.tagTimeStartTime = value;
    }

    tagTimeEndDate: Moment = moment();
    setTagTimeEndDate(value: Moment) {
        this.tagTimeEndDate = value;
    }

    tagTimeEndTime: Moment = moment();
    setTagTimeEndTime(value: Moment) {
        this.tagTimeEndTime = value;
    }

    // 在taskData更新时一并更新(index.ts)
    tagItems: TagItem[] = [];
    setTagItems(value: TagItem[]) {
        this.tagItems = value;
    }

    resultMsg: string = "";
    setResultMsg(value: string) {
        this.resultMsg = value;
    }
    
    isChangeTagTextPushed: boolean = false;
    setIsChangeTagTextPushed(value: boolean) {
        this.isChangeTagTextPushed = value;
    }

    get isTagTimeValid():boolean {
        if (!this.shouldFilterTagTime) {
            return true;
        }

        return moment(this.tagTimeStartStr, MOMENT_DATETIME_FORMAT)
            .isSameOrBefore(moment(this.tagTimeEndStr, MOMENT_DATETIME_FORMAT));
    }

    // yyyy-MM-dd HH:mm
    get tagTimeStartStr(): string{
        return this.tagTimeStartDate.format(MOMENT_DATE_FORMAT)
            + " "
            + this.tagTimeStartTime.format(MOMENT_TIME_FORMAT);
    }

    get tagTimeEndStr(): string {
        return this.tagTimeEndDate.format(MOMENT_DATE_FORMAT)
            + " "
            + this.tagTimeEndTime.format(MOMENT_TIME_FORMAT);
    }

    // 设置标注项的整个值
    setTagItemValue(tagItemIndex: number, value: string[]) {
        this.tagItems[tagItemIndex].value = value;
    }

    // 设置标注项某个元素的值
    setTagItemValueElement(tagItemIndex: number,
        elementIndex: number, element: string) {
        this.tagItems[tagItemIndex].value[elementIndex] = element;
    }

    // 向标注项值添加一个元素
    addTagItemValueElement(tagItemIndex: number, element: string) {
        this.tagItems[tagItemIndex].value.push(element);
    }

    // 从标注项值中删除一个元素
    removeTagItemValueElement(tagItemIndex: number, elementIndex: number) {
        this.tagItems[tagItemIndex].value.splice(elementIndex, 1);
    }

    removeTexts(indexes: number[]) {
        const indexesCopied = [...indexes];
        indexesCopied.sort((a, b) => b - a);
        for (const i in indexesCopied) {
            this.texts.splice(indexesCopied[i], 1);
        }
    }

    // 修改文本
    changeText(index: number, newText: string) {
        this.texts[index].text = newText;
    }

    // 修改标注
    changeTextTag(index: number, newTag: Tag) {
        this.texts[index].tag = newTag;
    }
}

export default new QueryData();
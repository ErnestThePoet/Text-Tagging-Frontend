import { makeAutoObservable } from "mobx";
import type { Text, Tag, TagItem } from "../modules/types";
import userData from "./user-data";
import { getCurrentDateTimeStr } from "../modules/utils/date-time";

class TaggingData{
    constructor() {
        makeAutoObservable(this);
    }

    texts: Array<Text> = [];

    setTexts(texts: Array<Text>) {
        this.texts = texts;
    }

    changeTag(textIndex: number, tagItemIndex: number, value: string[]) {
        this.texts[textIndex].tag.tagItems[tagItemIndex].value = value;
        this.texts[textIndex].tag.tagTime = getCurrentDateTimeStr();
        this.texts[textIndex].tag.taggerName = userData.name;
    }
}

export default new TaggingData();
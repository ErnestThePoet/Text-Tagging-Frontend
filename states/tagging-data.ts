import { makeAutoObservable } from "mobx";
import { Text } from "../modules/objects/text";
import type { IText } from "../modules/objects/text";
import userData from "./user-data";
import { getCurrentDateTimeStr } from "../modules/utils/date-time";

class TaggingData{
    constructor() {
        makeAutoObservable(this);
    }

    texts: Array<Text> = [];

    hasUnsavedChanges: boolean = false;

    get taggedTextCount(): number{
        return this.texts.filter(x => x.isTagged()).length;
    }

    setTexts(texts: Array<IText>) {
        this.texts = [];
        for (const i of texts) {
            this.texts.push(new Text(i));
        }
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
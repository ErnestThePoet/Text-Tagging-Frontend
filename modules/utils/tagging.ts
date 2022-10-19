import { cloneDeep } from "lodash-es";
import taskData from "../../states/task-data";
import { TagItem, Text } from "../objects/text";

export function copyAndFilterEmptyInputValues(tagItems: Array<TagItem>): Array<TagItem> {
    const tagItemsCopy: Array<TagItem> = cloneDeep(tagItems);

    for (const i of tagItemsCopy) {
        switch (taskData.idMetaMap[i.id].type) {
            case 2:
            case 3:
                i.value = i.value.filter(x => x !== "");
                break;
        }
    }

    return tagItemsCopy;
}

export function copyAndFilterEmptyInputValuesInTexts(texts: Array<Text>): Array<Text> {
    const textsCopy: Array<Text> = cloneDeep(texts);

    for (const i of textsCopy) {
        for (const j of i.tag.tagItems) {
            switch (taskData.idMetaMap[j.id].type) {
                case 2:
                case 3:
                    j.value = j.value.filter(x => x !== "");
                    break;
            }
        }
    }

    return textsCopy;
}

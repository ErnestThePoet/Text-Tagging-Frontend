import taskData from "../states/task-data";
import type { TagItemMeta } from "./objects/task";

interface ImportText{
    userId: string;
    text: string;
    fileName: string;
}

interface ImportTagItem {
    id: number;
    value: string[];
}

interface ImportTag{
    taggerName: string;
    tagTime: string;
    tagItems: Array<ImportTagItem>;
}

type ValidUploadTextTagItemValue =
    string | number | Array<string> | Array<number> | Array<string | number>;

interface ValidUploadTextTagItem{
    itemName: string;
    value: ValidUploadTextTagItemValue;
}
    
interface ValidUploadText{
    id: string;
    text: string;
    tag: Array<ValidUploadTextTagItem>;
}

function toImportTagItem(
    meta:TagItemMeta,
    item: ValidUploadTextTagItem): ImportTagItem{
    let value: string[] = [];
    
    if (Array.isArray(item.value)) {
        value= item.value.map(x => x.toString());
    }
    else {
        const choice = meta.choices!.find(x => x.external === item.value)!;
        if (choice.internal !== undefined) {
            value = [choice.internal];
        }
    }

    return {
        id: meta.id,
        value
    };
}

// 要求uploadTexts已经过checkImportDataset函数检查
export const toImportTextsTags = (
    fileName: string,
    taggerName: string,
    tagTime: string,
    uploadTexts: ValidUploadText[]) => {
    const result: {
        texts: ImportText[];
        tags: ImportTag[];
    } = {
        texts: [],
        tags: []
    };

    for (const i of uploadTexts) {
        result.texts.push({
            userId: i.id,
            text: i.text,
            fileName
        });

        result.tags.push({
            taggerName,
            tagTime,
            tagItems: i.tag.map(x => toImportTagItem(taskData.nameMetaMap[x.itemName],x))
        });
    }

    return result;
}
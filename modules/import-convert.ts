import taskData from "../states/task-data";
import type { TagItemMeta } from "./objects/task";

// Import开头均表示后端接收的类型
interface ImportText {
    userId: string;
    text: string;
    fileName: string;
}

interface ImportTagItem {
    id: number;
    value: string[];
}

interface ImportTag {
    taggerName: string;
    tagTime: string;
    tagItems: Array<ImportTagItem>;
}

// Upload开头的均表示上传文件中的类型
type ValidUploadTextTagItemScalarValue =
    string | number;
type ValidUploadTextTagItemArrayValue =
    Array<string> | Array<number> | Array<string | number>;
type ValidUploadTextTagItemValue =
    ValidUploadTextTagItemScalarValue | ValidUploadTextTagItemArrayValue;

interface ValidUploadTextTagItem {
    itemName: string;
    value: ValidUploadTextTagItemValue;
}

interface ValidUploadText {
    id: string;
    text: string;
    tag: Array<ValidUploadTextTagItem>;
}

function toImportTagItem(
    meta: TagItemMeta,
    item: ValidUploadTextTagItem): ImportTagItem {
    let value: string[] = [];

    switch (meta.type) {
        // 单选
        case 0: {
            const choice = meta.choices!.find(x => x.external === item.value)!;
            if (choice.internal !== undefined) {
                value = [choice.internal];
            }
            break;
        }
        // 多选
        case 1: {
            value = (<ValidUploadTextTagItemArrayValue>item.value)
                .map(x => meta.choices!.find(u => u.external === x)!.internal!);
            break;
        }
        // 单输入
        case 2: {
            value = [item.value.toString()];
            break;
        }
        // 多输入
        case 3: {
            value = (<ValidUploadTextTagItemArrayValue>item.value).map(x => x.toString());
            break;
        }
    }

    return {
        id: meta.id,
        value
    };
}

// 将上传文件格式转换为导入数据库的后端接受格式
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
            tagItems: i.tag.map(x => toImportTagItem(taskData.nameMetaMap[x.itemName], x))
        });
    }

    return result;
}

function toRequiredType(value: string, type: "string" | "number") {
    switch (type) {
        case "string":
            return value.toString();
        case "number":
            return parseFloat(value);
        default:
            return value;
    }
}

function toUploadTagItem(
    meta: TagItemMeta,
    item: ImportTagItem
): ValidUploadTextTagItem {
    const noneValue = "NONE";
    const errorValue = "ERROR";
    let value: ValidUploadTextTagItemValue = errorValue;

    switch (meta.type) {
        // 单选
        case 0:
            // 未标注则导出为代表未标注的外部值（配置文件应当提供一个代表未标注的外部值，否则设为null）
            if (item.value.length === 0) {
                value = meta.choices!.find(x => x.internal === undefined)?.external ?? noneValue;
            }
            else {
                value = meta.choices!.find(x => x.internal !== undefined
                    && x.internal === item.value[0])?.external ?? errorValue;
            }
            break;
        // 复选
        case 1: {
            value = item.value.map(x => meta.choices!.find(
                u => u.internal !== undefined
                    && u.internal === x)!.external);
            break;
        }
        // 单输入
        case 2: {
            if (item.value.length === 0) {
                value = [];
            }
            else {
                // 转换为导入格式所规定的类型
                if (meta.options?.type !== undefined) {
                    value = [toRequiredType(item.value[0], meta.options?.type[0])];
                }
                else {
                    value = [item.value[0]];
                }
            }

            break;
        }
        // 多输入
        case 3: {
            if (meta.options?.type !== undefined) {
                if (meta.options.type.length === 1) {
                    value=item.value.map(x=>toRequiredType(x, meta.options!.type![0]));
                }
                else {
                    value = item.value.map((x,i) => toRequiredType(x, meta.options!.type![i]));
                }
            }
            else {
                value = [item.value[0]];
            }
            break;
        }
    }

    return {
        itemName: meta.name,
        value
    };
}

// 将导入数据库的后端接受格式转换为上传文件格式（用于导出数据）
export const toUploadTexts = (importTexts: ImportText[], importTags: ImportTag[]) => {
    const uploadTexts: ValidUploadText[] = [];
    for (const i in importTexts) {
        const text = importTexts[i];
        const tag = importTags[i];

        uploadTexts.push({
            id: text.userId,
            text: text.text,
            tag: tag.tagItems.map(x => toUploadTagItem(taskData.idMetaMap[x.id], x))
        });
    }
    return uploadTexts;
}
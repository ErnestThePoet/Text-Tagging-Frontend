import type { CheckResult } from "../states/task-data";
import taskData from "../states/task-data";

// 通用检查步骤：
// 1.检查元素类型
// 2.检查元素取值或内部属性

// 类型检查
export function checkImportDataset(importTexts: any): CheckResult{
    if (!Array.isArray(importTexts)) {
        return {
            ok: false,
            msg: "导入文件不是JSON数组"
        };
    }
    
    if (importTexts.length === 0) {
        return {
            ok: false,
            msg: "JSON数组不能为空"
        };
    }

    for (const i in importTexts) {
        const currentText = importTexts[i];

        if (typeof (currentText) !== "object") {
            return {
                ok: false,
                msg: `下标为${i}的文本不是对象类型`
            };
        }

        if (!("id" in currentText)
            || typeof (currentText.id) !== "string" // || currentText.id === ""
        ) {
            return {
                ok: false,
                msg: `下标为${i}的文本id属性不存在或不是字符串类型` // 或不是非空字符串
            };
        }

        if (!("text" in currentText)
            || typeof (currentText.text) !== "string"
            || currentText.text === "") {
            return {
                ok: false,
                msg: `下标为${i}的文本text属性不存在或不是非空字符串`
            };
        }

        if (!("tag" in currentText)
            || !Array.isArray(currentText.tag)) {
            return {
                ok: false,
                msg: `下标为${i}的文本tag属性不存在或不是数组`
            };
        }

        const validation = taskData.importValidation;

        if (currentText.tag.length !== validation.tagItemCount) {
            return {
                ok: false,
                msg: `下标为${i}的文本tag属性长度不是${validation.tagItemCount}`
            };
        }

        for (const j in currentText.tag) {
            const currentTag = currentText.tag[j];
            if (typeof (currentTag) !== "object") {
                return {
                    ok: false,
                    msg: `下标为${i}的文本的第${j}个标注项不是对象类型`
                };
            }

            if (!("itemName" in currentTag)
                || typeof (currentTag.itemName) !== "string"
                || currentTag.itemName === "") {
                return {
                    ok: false,
                    msg: `下标为${i}的文本的第${j}个标注项的itemName属性不存在或不是非空字符串`
                };
            }

            if (!("value" in currentTag)) {
                return {
                    ok: false,
                    msg: `下标为${i}的文本的第${j}个标注项的value属性不存在`
                };
            }
        }

        for (const j of validation.tagItemMetas) {
            const matchingTag = currentText.tag.find(x => x.itemName === j.name);
            if (matchingTag === undefined) {
                return {
                    ok: false,
                    msg: `下标为${i}的文本没有包含标注项"${j.name}"`
                };
            }

            const valueCheckResult = j.valueCheck(matchingTag.value);

            if (!valueCheckResult.ok) {
                return {
                    ok: false,
                    msg: `下标为${i}的文本的标注项"${j.name}"取值非法：${valueCheckResult.msg}`
                };
            }
        }
    }

    return {
        ok: true,
        msg: ""
    };
}
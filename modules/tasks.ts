import type { CheckResult } from "./types";

type ValueCheckFn = (x: any) => CheckResult;

interface TagItemValidation{
    // 标注项数量
    tagItemCount: number;
    // 各标注项名称与取值检查方法
    tagItemMetas: Array<{
        itemName: string;
        valueCheck: ValueCheckFn;
    }>
}

// 生成单选标注项检查方法
const createSingleChoiceValueCheck:
    (choices: any[]) => ValueCheckFn
    = (choices: any[]) => (
        (x: any) => {
            if (!choices.includes(x)) {
                return {
                    ok: false,
                    msg: `不是[${choices}]之一`
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );

// 生成多选标注项检查方法
const createMultipleChoiceValueCheck:
    (choices: any[],
        options?:{
            allowDuplicate?: boolean;
            minCount ?: number;
            maxCount ?: number;
        }) => ValueCheckFn
    = (choices: any[],
        options?: {
            allowDuplicate?: boolean;
            minCount?: number;
            maxCount?: number;
        }) => (
        (x: any) => {
            if (!Array.isArray(x)) {
                return {
                    ok: false,
                    msg: "不是数组类型"
                }
            }

            if (x.some(u => !choices.includes(u))) {
                return {
                    ok: false,
                    msg: `不是全部由[${choices}]中的选项组成`
                }
            }

            if (options?.minCount !== undefined
                && x.length < options.minCount) {
                return {
                    ok: false,
                    msg: "元素数量过少"
                }
            }

            if (options?.maxCount !== undefined
                && x.length > options.maxCount) {
                return {
                    ok: false,
                    msg: "元素数量过多"
                }
            }

            if (!options?.allowDuplicate &&
                x.some(u => x.filter(v => u === v).length > 1)) {
                return {
                    ok: false,
                    msg: "包含重复元素"
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );

// 生成多元素标注项检查方法
const createMultipleElementCheck:
    (options?: {
            allowDuplicate?: boolean;
            minCount?: number;
            maxCount?: number;
        }) => ValueCheckFn
    = (options?: {
            allowDuplicate?: boolean;
            minCount?: number;
            maxCount?: number;
        }) => (
        (x: any) => {
            if (!Array.isArray(x)) {
                return {
                    ok: false,
                    msg: "不是数组类型"
                }
            }

            if (options?.minCount !== undefined
                && x.length < options.minCount) {
                return {
                    ok: false,
                    msg: "元素数量过少"
                }
            }

            if (options?.maxCount !== undefined
                && x.length > options.maxCount) {
                return {
                    ok: false,
                    msg: "元素数量过多"
                }
            }

            if (!options?.allowDuplicate
                && x.some(u => x.filter(v => u === v).length > 1)) {
                return {
                    ok: false,
                    msg: "包含重复元素"
                }
            }

            return {
                ok: true,
                msg: ""
            }
        }
    );

export const TAG_ITEM_VALIDATIONS: { [_: string]: TagItemValidation } = {
    "1": {
        tagItemCount: 4,
        tagItemMetas: [
            {
                itemName: "分级",
                valueCheck: createSingleChoiceValueCheck([-1, 0, 1, 2, 3, 4, 5])
            },
            {
                itemName: "分类",
                valueCheck: createSingleChoiceValueCheck(["", "是", "否"])
            },
            {
                itemName: "维度",
                valueCheck: createMultipleChoiceValueCheck(
                    ["观点", "情感", "立场", "态度", "道德", "法律", "其它"],
                    { maxCount: 7 })
            },
            {
                itemName: "价值观词",
                valueCheck: createMultipleElementCheck()
            }
        ]
    }
};
export interface TagItem {
    id: number;
    value: string[];
}

export interface Tag {
    id: number | null;

    textId: number;

    taggerName: string;
    tagTime: string;

    tagItems: Array<TagItem>;
}

export interface IText{
    id: number;
    userId: string;
    text: string;
    tag: Tag;
}

export class Text {
    constructor(text: IText) {
        this.id = text.id;
        this.userId = text.userId;
        this.text = text.text;
        this.tag = text.tag;
    }

    id: number=-1;
    userId: string="";
    text: string="";
    tag: Tag = { id: null, textId: -1, taggerName: "", tagTime: "", tagItems: [] };
    
    isTagged(): boolean{
        let taggedItemCount = 0;
        for (const i of this.tag.tagItems) {
            if (i.value.length > 0) {
                taggedItemCount++;
            }
        }

        return taggedItemCount === this.tag.tagItems.length;
    }

    getTextPreview(length: number = 9):string {
        if (this.text.length <= length) {
            return this.text;
        }

        return this.text.slice(0, length) + "..";
    }
}
import { makeAutoObservable } from "mobx";
import type { Text } from "../modules/objects/text";

class QueryData{
    constructor() {
        makeAutoObservable(this);
    }
    
    texts: Array<Text> = [];

    setTexts(texts: Array<Text>) {
        this.texts = texts;
    }
}

export default new QueryData();
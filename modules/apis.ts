const DEBUG: boolean = true;

let urlPrefix = "/api/";

if (DEBUG) {
    urlPrefix = "http://localhost:11750/api/";
}

const APIS = {
    // User general
    login:"user/login",
    autoLogin:"user/auto_login",
    logout:"user/logout",
    changePw: "user/change_pw",

    // Task general
    getTasks:"task/get_tasks",
    
    // Task dataset
    getDatasetStat: "dataset/get_stat",
    importDataset: "dataset/import",
    
    // Tagging
    getTextsToTag: "text/get_texts_to_tag",
    addTags: "text/add_tags",
    changeText: "text/change_text",
}

for (let i in APIS) {
    APIS[i] = urlPrefix + APIS[i];
}

export default APIS;
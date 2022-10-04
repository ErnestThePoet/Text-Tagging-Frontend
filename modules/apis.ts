const DEBUG: boolean = true;

let urlPrefix = "/";

if (DEBUG) {
    urlPrefix = "http://localhost:10621/";
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
    getTextsToTag:"text/get_texts_to_tag"
}

for (let i in APIS) {
    APIS[i] = urlPrefix + APIS[i];
}

export default APIS;
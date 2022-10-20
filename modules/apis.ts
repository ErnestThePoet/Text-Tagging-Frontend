const DEBUG: boolean = false;

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

    // User Management
    getUsersInfo: "user_management/get_users_info",
    createUser: "user_management/create",
    deleteUsers: "user_management/delete",
    resetPassword: "user_management/reset_password",
    changeLevel:"user_management/change_level",

    // Task general
    getTasks:"task/get_tasks",
    
    // Task dataset
    getDatasetStat: "dataset/get_stat",
    importDataset: "dataset/import",
    exportDataset: "dataset/export",
    deleteDataset: "dataset/delete",
    
    // Tagging
    getTextsToTag: "text/get_texts_to_tag",
    addTags: "text/add_tags",
    changeText: "text/change_text",

    // Adding texts
    addTexts: "text/add_texts",
    
    // Text Query
    queryTexts: "text/query",
    changeTag: "text/change_tag",
    deleteTexts:"text/delete_texts"
}

for (let i in APIS) {
    APIS[i] = urlPrefix + APIS[i];
}

export default APIS;
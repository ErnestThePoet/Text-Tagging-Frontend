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
    
    // Task dataset
    getDatasetStat:"dataset/get_stat"
}

for (let i in APIS) {
    APIS[i] = urlPrefix + APIS[i];
}

export default APIS;
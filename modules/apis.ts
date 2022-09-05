const DEBUG: boolean = true;

let urlPrefix = "/";

if (DEBUG) {
    urlPrefix = "http://localhost:10621/";
}

const APIS = {
    login:"account/login",
    autoLogin:"account/auto_login",
    logout:"account/logout",
    changePw:"account/change_pw",
}

for (let i in APIS) {
    APIS[i] = urlPrefix + APIS[i];
}

export default APIS;
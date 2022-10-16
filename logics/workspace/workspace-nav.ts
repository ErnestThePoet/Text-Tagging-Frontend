import axios from "axios";
import Router from "next/router";
import APIS from "../../modules/apis";
import userData from "../../states/user-data";

export const onNavMenuItemClick = (key: string) => {
    let targetPath: string = "";
    switch (key) {
        case "0":
            targetPath = "/workspace/tagging";
            break;
        case "1":
            targetPath = "/workspace/add-texts";
            break;
        case "2":
            targetPath = "/workspace/query";
            break;
        case "3":
            targetPath = "/workspace/management";
            break;
    }

    if (Router.pathname !== targetPath) {
        Router.push(targetPath);
    }
}

export const onAccountMenuItemClick = (key:string) => {
    switch (key) {
        case "0":
            //TODO:add guide
            break;
        case "1":
            logout();
            break;
    }
}

const logout = () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId !== null && sessionId.length > 25) {
        axios.postForm(APIS.logout, { sessionId });
    }

    localStorage.removeItem("sessionId");

    userData.clear();

    Router.replace("/");
}
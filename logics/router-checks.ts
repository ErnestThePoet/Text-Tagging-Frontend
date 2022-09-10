import Router from "next/router";
import userData from "../states/user-data";

export const checkIsLoggedIn = () => {
    if (!userData.isLoggedIn) {
        Router.replace("/");
    }
}

export const checkIsAdmin = () => {
    if (!userData.isAdmin) {
        Router.replace("/");
    }
}
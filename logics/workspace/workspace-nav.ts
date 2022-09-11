import axios from "axios";
import Router from "next/router";
import APIS from "../../modules/apis";
import LoginForm from "../../components/index/login-form";
import userData from "../../states/user-data";

export const onAccountMenuItemClick = (key:string) => {
    switch (key) {
        case "2":
            Router.push("/management/dataset");
            break;
    }
}
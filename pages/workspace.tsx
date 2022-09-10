import React from "react";
import { observer } from "mobx-react-lite";
import * as L from "../logics/workspace";
import { checkIsLoggedIn } from "../logics/router-checks";
import styles from "../styles/workspace.module.scss";

export default class WorkspacePage extends React.Component{
    constructor(props: {}) {
        super(props);
    }
    
    componentDidMount(): void {
        checkIsLoggedIn();
    }

    thisComponent = observer(() => (
        <div className={styles.divMainWrapper}>

        </div>
    ));

    render = () => (
        <this.thisComponent />
    );
}
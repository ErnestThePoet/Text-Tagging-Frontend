import React from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react-lite';
import LoginForm from '../components/index/login-form';
import TaskPicker from '../components/index/task-picker';
import userData from '../states/user-data';
import * as L from "../logics/index";
import styles from '../styles/index.module.scss';

export default class Home extends React.Component{
  constructor(props: {}) {
    super(props);
  }

  componentDidMount = () => {
    L.tryAutoLogin();
  }

  thisComponent = observer(() => (
    <div className={styles.divMainWrapper}>
      <Head>
        <title>文本价值观标注系统</title>
        <meta name="description" content="HITNLP文本价值观标注系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section>
          HITNLP
          <br />
          文本价值观标注系统
        </section>

        {
          userData.isLoggedIn
            ?
            <section className={styles.sectionSelectTask}>
              <span className={styles.spanSelectTaskTitle}>
                <b>{`欢迎您，${userData.name}~`}</b>
                <br/>
                请选择标注任务以开始：
              </span>

              <TaskPicker/>
            </section>
            :
            <section className={styles.sectionLogin}>
              <span className={styles.spanLoginTitle}>
                登录标注系统
              </span>

              <LoginForm/>
            </section>
        }
      </main>
    </div>
  ));

  render = () => (
    <this.thisComponent />
  );
}

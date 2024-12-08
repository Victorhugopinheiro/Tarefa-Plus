import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import hero from '../../public/hero.png'
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/connectionservices";

interface InfoDb{
  comments: number
  tarefas:number
}

export default function Home({tarefas, comments} :InfoDb) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>

        <Image
          className={styles.img}
          src={hero}
          alt="Imagem da home"
        />
        </div>
        <h1 className={styles.tittle}>Sistema feito para você organizar<br />seus estudos e tarefas</h1>

        <div className={styles.dadoss}>
          <section className={styles.section}>
            <span className={styles.dadosSpan}>
              +{tarefas} posts
            </span>
          </section>

          <section className={styles.section}>
            <span >
              +{comments} comentarios 
            </span>
          </section>

        </div>
      </main>
    </div>

  );
}


export const getStaticProps: GetStaticProps = async () => {
  const collectionPathTarefas = collection(db, "tarefas")
  const snapShotTarefas = await getDocs(collectionPathTarefas)

  const collectionPathComments = collection(db, "comments")
  const snapShotComments = await getDocs(collectionPathComments)

  return{
    props: {
      tarefas:snapShotTarefas.size || 0,
      comments: snapShotComments.size || 0

    },

    revalidate: 60
  }
}






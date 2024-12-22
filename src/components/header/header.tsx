import Link from 'next/link'
import styles from './header.module.css'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FiThermometer } from 'react-icons/fi'

export default function Header() {

const {data: session, status} = useSession() 
    return (
        <header className={styles.header}>
            
            
                <section className={styles.section}>
                    <nav className={styles.nav}>
                        <Link className={styles.tarefas} href={"/"}>
                            <h1>Tarefas <span className={styles.meuMais}>+</span></h1>
                        </Link>

                        {session?.user && (
                            <Link   href={"/dashboard"}>
                            <button className={styles.sectionButton}>Meu painel</button>
                        </Link>
                        )}
                    </nav>

                    {status === "loading" ? (
                        <>
                        </>
                    ) : session ? (
                        <button onClick={() => signOut()} className={styles.button}>{session.user?.name}</button>
                    ) : (
                        <button onClick={() => signIn("google")} className={styles.button}>Acessar </button>
                    )}

                    <FiThermometer/>

                    
                </section>
            

        </header>
    )
}
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import styles from './dashoboard.module.css'
import { TextArea } from "@/components/textarea/textarea"
import { FiShare2 } from "react-icons/fi"
import { FaTrash } from "react-icons/fa"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { db } from "@/services/connectionservices"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore"
import Link from "next/link"

interface GetUSer {
    user: {
        email: string
    }
}

interface Tasks {
    id: string
    user: string
    data: Date
    check: boolean
    tarefa: string
}

export default function dashboard({ user }: GetUSer) {

    const [textArea, setTextArea] = useState("")
    const [checked, setChecked] = useState(false)
    const [tasks, setTasks] = useState<Tasks[]>([])

    function check(e: ChangeEvent<HTMLInputElement>) {

        setChecked(e.target.checked)

    }

    function getTesks(e: FormEvent) {

        e.preventDefault()

        if (textArea === "") return


        addDoc(collection(db, "tarefas"), {
            tarefa: textArea,
            check: checked,
            data: new Date(),
            user: user.email
        })

        setTextArea("")
        setChecked(false

        )

    }

    useEffect(() => {
        function getTasks() {

            const pathCollection = collection(db, "tarefas")
            const q = query(pathCollection, orderBy("data", "desc"), where("user", "==", user.email))
            onSnapshot(q, (snapshot) => {
                console.log(snapshot)
                let lista = [] as Tasks[]

                const onSub = snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        user: doc.data().user,
                        check: doc.data().check,
                        data: doc.data().data,
                        tarefa: doc.data().tarefa

                    })
                })

                console.log(lista)

                setTasks(lista)
            })

        }

        getTasks()


       
    }, [])

    async function share (id:string) {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        )
    }

    async function deteteTask (id:string) {
        const pathDoc = doc(db, "tarefas", id)
        await deleteDoc(pathDoc)
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <section className={styles.section}>

                    <div className={styles.contentForm}>
                        <h1 className={styles.tittle}>Qual a sua tarefa?</h1>
                        <form onSubmit={getTesks} className={styles.form}>

                            <TextArea value={textArea} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextArea(e.target.value)} placeholder="Digite a tarefa..." />

                            <div className={styles.checkbox}>
                                <input checked={checked} onChange={check} className={styles.input} type="checkbox" />
                                <label>Deixar tarefa publica</label>
                            </div>

                            <button className={styles.button}>Registrar</button>

                        </form>

                    </div>
                </section>

                <section className={styles.section2}>
                    <h1 className={styles.meuH1}>Minhas tarefas</h1>
                    {tasks.map((doc) => (
                        <article key={doc.id} className={styles.article}>

                            {doc.check === true && (
                                <div className={styles.public}>
                                    <label>Publico</label>
                                    <button onClick={() => share(doc.id)} className={styles.logo}><FiShare2 size={26} color="#3183ff" /></button>
                                </div>
                            )}


                            <div className={styles.infos}>
                                {doc.check === true ? <Link href={`/task/${doc.id}`}> <p>{doc.tarefa}</p> </Link>
                                : <p>{doc.tarefa}</p>}
                                <button onClick={() => deteteTask(doc.id)} className={styles.logo}><FaTrash size={26} color="red" /></button>
                            </div>




                        </article>
                    ))}
                </section>
            </main>
        </div>

    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            },
        };
    }


    return {
        props: {
            user: {
                email: session?.user.email
            }

        }
    }

}
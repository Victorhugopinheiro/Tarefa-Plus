import { db } from "@/services/connectionservices";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { GetServerSideProps } from "next";
import styles from './task.module.css';
import { TextArea } from "@/components/textarea/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { FiTrash } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

interface Comments {
    comment: string;
    data: string | null;
    email: string;
    idDoComment: string;
    name: string;
    idUser: string;
}

interface TaskProps {
    item: {
        user: string;
        data: string;
        id: string;
        tarefa: string;
        check: boolean;
    };
    comments: Comments[];
}

export default function Tasks({ item, comments }: TaskProps) {
    const [textArea, setTextArea] = useState("");
    const [commentss, setCommentss] = useState<Comments[]>(comments || []);

    const { data: session } = useSession();

    async function getComments(e: FormEvent) {
        e.preventDefault();

        if (textArea === "") return;
        if (!session?.user?.email) return;

        try {
            const commentPath = await addDoc(collection(db, "comments"), {
                email: session?.user?.email,
                date: new Date(),
                name: session?.user?.name,
                comment: textArea,
                idDoComment: item?.id
            });

            const data: Comments = {
                idUser: commentPath.id,
                comment: textArea,
                data: null,
                email: session.user?.email || "",
                idDoComment: item.id,
                name: session.user?.name || "",
            };

            setCommentss((comments) => [...comments, data]);
            setTextArea("");

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteTask (id:string) {
        const deletee = doc(db, "comments", id)
        deleteDoc(deletee)

        setCommentss((comments) => [...comments.filter((item) => item.idUser !== id) ])
        
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.article}>
                    <p>{item.tarefa}</p>
                </article>
            </main>
            <section className={styles.section}>
                <h2>Deixar comentario</h2>
                <form onSubmit={getComments}>
                    <TextArea value={textArea} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTextArea(e.target.value)} placeholder="Digite seu comentario..." />
                    <button className={styles.button} disabled={!session?.user} type="submit">Enviar comentario</button>
                </form>
            </section>

            <section className={styles.sectionAllCommets}>
                <h2>Todos os comentarios</h2>
                {commentss.length === 0 && (
                    <h2>Tarefa sem comentarios...</h2>
                )}

                {commentss.map((doc) => (
                    <article className={styles.articleComment} key={doc.idUser}>
                        <div className={styles.infoUser}>
                            <p>{doc.name}</p>
                            {doc.email === session?.user?.email && (
                                <button onClick={() => deleteTask(doc.idUser)} className={styles.buttonTrash}><FaTrash size={18} color="red"/></button>
                            )}
                        </div>

                        <p>{doc.comment}</p>
                    </article>
                ))}
            </section>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;
    console.log(id);

    const collectionPath = collection(db, "comments");
    const q = query(collectionPath, where("idDoComment", "==", id));
    const getComments = await getDocs(q);

    let listaComments: Comments[] = [];

    getComments.forEach((doc) => {
        listaComments.push({
            comment: doc.data().comment,
            data: doc.data().data || null,
            email: doc.data().email,
            idDoComment: doc.data().idDoComment,
            name: doc.data().name,
            idUser: doc.id
        });
    });

    console.log(listaComments);

    const pathDoc = doc(db, "tarefas", id);
    const snapshot = await getDoc(pathDoc);

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    if (!snapshot.data()?.check) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        };
    }

    const data = snapshot.data()?.data?.seconds * 1000;

    const task = {
        user: snapshot.data()?.user,
        data: new Date(data).toLocaleDateString(),
        id: snapshot.id,
        tarefa: snapshot.data()?.tarefa,
        check: snapshot.data()?.check
    };

    return {
        props: {
            item: task,
            comments: listaComments,
        }
    };
};

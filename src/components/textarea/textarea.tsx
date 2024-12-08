import { HtmlProps } from "next/dist/shared/lib/html-context.shared-runtime";
import { HTMLProps } from "react";
import styles from './textarea.module.css'



export function TextArea ({...rest} : HTMLProps<HTMLTextAreaElement>) {

    return(
        <textarea className={styles.textArea} {...rest}></textarea>
    )
}
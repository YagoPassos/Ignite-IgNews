import { GetStaticProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { RichText } from "prismic-reactjs"
import { asHTML } from "@prismicio/helpers"
import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss'



interface PostPreviewProps {

    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string,
    }

}

export default function PostPreview({ post }: PostPreviewProps) {
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>

                    <div 
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{__html: post.content }}
                    />
                </article>
            </main>
        </>
    )
}

export const getStaticPaths = () => {
    return{
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug } = params;

    const prismic = getPrismicClient()

    const response = await prismic.getByUID<any>('post', String(slug), {})

    // console.log(JSON.stringify(response, null, 2))
    // console.log(JSON.stringify(RichText.render(response.data.content), null, 2))

    console.log(asHTML(response.data.content))

    const post = {
        slug,
        title: response.data.title[0].text,
        content: asHTML(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: { post }
    }

}
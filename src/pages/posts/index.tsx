import Head from 'next/head';
import styles from './styles.module.scss'
import * as Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import { GetStaticProps } from 'next';
// import { RichText } from 'prismic-dom'
import Link from 'next/link';

type Post = {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string,
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title> POST | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a href="#">
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    // const response = await prismic.get<any>([
    //     Prismic.predicate.at('document.type', 'post')
    //   ],{
    //     fetch: ['post.title', 'post.content'],
    //     pageSize: 100,
    //   })

    const response = await prismic.get<any>(
        {
            predicates: [
                Prismic.predicate.at('document.type', 'post'),
            ],
            fetch: ['post.title', 'post.content'],
            pageSize: 100
        }
    )

    // console.log(JSON.stringify(response, null, 2));

    const posts = response.results.map((post: any) => {
        return {
            slug: post.uid,
            title: post.data.title[0].text,
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })
    return {
        props: { posts }
    }


}
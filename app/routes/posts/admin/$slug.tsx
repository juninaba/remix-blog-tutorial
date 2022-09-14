import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import invariant from "tiny-invariant";
import {deletePost, getPost} from "~/models/post.server";
import {marked} from "marked";
import {Form, useLoaderData} from "@remix-run/react";

type LoaderData = { post: Post, html: string };

type ActionData =
    | {
    slug: null | string;
    }
    | undefined;

export const loader: LoaderFunction = async ({
    params,
}) => {
    invariant(params.slug, `params.slug is required`);

    const post = await getPost(params.slug);
    invariant(post, `Post not found: ${params.slug}`);

    const html = marked(post.markdown);
    return json<LoaderData>({ post, html });
}

export const action: ActionFunction = async ({
    params,
}) => {
    invariant(params.slug, `params.slug is required`);

    await deletePost(params.slug);

    return redirect("/posts/admin")
}

export default function PostSlug() {
    const { post, html } = useLoaderData() as LoaderData;
    return (
        <main className="mx-auto max-w-4xl">
            <h1 className="my-6 border-b-2 text-center text-3xl">
                {post.title}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
            <Form method="post">
                <p className="text-right">
                    <button
                        type="submit"
                        className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
                    >
                        Delete
                    </button>
                </p>
            </Form>
        </main>
    )
}
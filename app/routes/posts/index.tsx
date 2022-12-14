import {Link, useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/node";

import {getPosts} from "~/models/post.server";

type LoaderData = {
    posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
    return json<LoaderData>({
        posts: await getPosts(),
    });
};

export default function Posts() {
    const {posts} = useLoaderData() as LoaderData;
    return (
        <main>
            <h1>Posts</h1>
            <ul>
                {posts.map((post) =>(
                    <li key={post.slug}>
                        <Link
                            to={post.slug}
                            className="text-blue-600 underline"
                        >
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="admin" className="text-red-600 underline">
                Admin
            </Link>
        </main>
    );
}
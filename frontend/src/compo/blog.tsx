import { useEffect, useState } from "react";
import { BlogsCard } from "./blogCard";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Appbar } from "./appbar";

interface TypeProps {
    id: string;
    author: {
        name: string;
    };
    title: string;
    content: string;
    createdDate: string;
}

export const BlogPage = () => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlogs] = useState<TypeProps[]>([]);
    // const [buttonVisible, setButtonVisible] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            console.log("Token", localStorage.getItem("token"));
            const geTBlogs = await axios.get(`${BACKEND_URL}/api/v1/blog/getblogs`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            console.log("BLOGS:", geTBlogs.data.getBlogS);
            setBlogs(geTBlogs.data.getBlogS);
            setLoading(false);
            // setButtonVisible(true); // Make the button visible after loading
        };
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Appbar />
                <div className="flex justify-center">
                    <div className="w-full max-w-xl p-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg animate-pulse mb-4">
                                {/* Skeleton Avatar */}
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="ml-3 w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                                {/* Skeleton Title */}
                                <div className="mt-4 w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                {/* Skeleton Content */}
                                <div className="mt-2 w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="mt-2 w-5/6 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="mt-2 w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                {/* Skeleton Reading Time */}
                                <div className="mt-2 w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Appbar />
            <div className="flex justify-center">
                <div className="w-full max-w-screen-lg p-4"> {/* Change to max-w-screen-lg */}
                    {blog.reverse().map((blogs,index) => (
                        <BlogsCard
                            key={index}
                            authorName={blogs.author.name || "Anonymous"}
                            title={blogs.title}
                            content={blogs.content}
                            publishedDate={blogs.createdDate.slice(0, 10)}
                            id={parseInt(blogs.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

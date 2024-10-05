import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { BACKEND_URL } from "../config";
import { BlogsCardHere } from "./blogCardHere";
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon
import { Avatar } from "./Avatar";

interface BlogsCardProps {
    id: string;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    onDelete: (deletedBlogId: string) => void;
    createdDate: string;
}

export const Myblogs = () => {
    const [blog, setBlog] = useState([]);
    const username = localStorage.getItem('username');
    const navigate = useNavigate(); // Initialize navigate

    console.log("USER: ", username);
    console.log("BloG:", blog);

    useEffect(() => {
        const fetchUserPost = async () => {
            try {
                const fetchData = await axios.get(`${BACKEND_URL}/api/v1/blog/userblog`, {
                    params: { username },
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                console.log(fetchData.data);
                setBlog(fetchData.data.userBloG[0].blogs);
            } catch (err) {
                console.error("Error on Fetching: ", err);
            }
        };
        fetchUserPost();
    }, [username]);

    const handleDelete = (deletedBlogId: number) => {
        setBlog(prevBlogs => prevBlogs.filter((blog: {id: number}) => blog.id !== deletedBlogId));
    };

    return (
        <div className="bg-gray-900 min-h-screen p-4">
            {/* Fixed Navbar with Back Icon */}
            <div className="fixed top-0 left-0 right-0 bg-gray-800 flex items-center p-2 z-50 shadow-lg">
                <button 
                    onClick={() => navigate(-1)} // Navigate back
                    className="flex items-center text-white bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition duration-200"
                >
                    <FaArrowLeft className="mr-2" /> {/* Back icon */}
                    Back
                </button>
                <div className="ml-auto rounded-full border-2 border-gray-500 p-1">
                    <Avatar name="Shad" size="big" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pt-16 max-w-xl mx-auto"> {/* Add padding top to avoid overlap with navbar */}
                {blog.length > 0 ? (
                    blog.map((blogs: BlogsCardProps) => (
                        <BlogsCardHere
                            key={blogs.id}
                            authorName={"Anonymous"}
                            title={blogs.title}
                            content={blogs.content}
                            publishedDate={blogs.createdDate.slice(0, 10)}
                            id={Number(blogs.id)}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <h1 className="text-white text-center">No Blogs Found</h1>
                )}
            </div>
        </div>
    );
};

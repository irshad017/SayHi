import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FaArrowLeft } from "react-icons/fa"; // Importing the left arrow icon
import { Avatar } from "./Avatar";

interface BlogType {
    author: {
        name: string;
    };
    createdDate: string;
    title: string;
    content: string;
}

export const OneBlog = () => {
    const [blog, setBlog] = useState<BlogType | null >(null);
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize the navigate function
    const Token = localStorage.getItem("token");
    console.log("JWT: ", Token);
    console.log("ID: ", id);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/getblog/${id}`, {
                    headers: {
                        Authorization: Token,
                    },
                });
                console.log("Fetched blog data:", response.data.getOne);
                setBlog(response.data.getOne); // Set the fetched blog data
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
        if (id) {
            fetchBlog(); // Fetch the blog only if the 'id' is available
        }
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4">
            <div className="absolute top-4 left-4">
                <button onClick={() => navigate(-1)} className="flex items-center text-blue-400 hover:text-blue-300 transition duration-200">
                    <FaArrowLeft className="mr-2" />
                    <span className="font-semibold">Back</span>
                </button>
            </div>
            {blog ? (
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="flex items-center mb-4">
                        <Avatar name={blog.author.name || "User"} size="small" />
                        <div className="flex flex-col ml-2">
                            <span className="font-semibold">{blog.author.name || "User"}</span>
                            <span className="text-gray-400 text-sm">
                                {blog.createdDate ? new Date(blog.createdDate).toLocaleDateString() : "Unknown Date"}
                            </span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{blog.title || "Untitled"}</h2>
                    <p className="text-md text-gray-300 mb-4">{blog.content || "No content available"}</p>
                    <div className="text-gray-400 text-sm">
                        {`Estimated read time: ${Math.ceil(blog.content.length / 500)} minute(s)`} {/* Read time calculation */}
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Loading blog...</p>
            )}
        </div>
    );
};

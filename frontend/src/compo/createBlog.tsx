import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom
import { FaArrowLeft } from "react-icons/fa"; // Importing the left arrow icon

export const CreateBlog = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // const [error, setError] = useState("");
    // const [msg, setMsg] = useState("");

    const PostIt = async () => {
        if (!title || !content) {
            toast.error("Please fill out both fields");
        } else {
            try {
                await axios.post(`${BACKEND_URL}/api/v1/blog/create`,
                    { title, content },
                    {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    }
                );
                toast.success("Successfully created post");
                setTitle("");
                setContent("");
            } catch (err) {
                toast.error("Error occurred!");
                console.log("Error:", err);
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
            {/* Back Button */}
            <button
                onClick={() => navigate('/blogs')} // Navigate back to /blogs
                className="self-start p-2 m-4 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-300"
            >
                <FaArrowLeft className="text-lg" />
            </button>

            <div className="w-full max-w-lg p-8 bg-gray-800 rounded-xl shadow-2xl space-y-6">
                {/* Error or Success messages */}
                {/* {error && <h3 className="text-red-500 mb-2">{error}</h3>} */}
                {/* {msg && <h3 className="text-green-500 mb-2">{msg}</h3>} */}

                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-4">Create a Blog Post</h1>

                {/* Input Fields */}
                <div className="grid grid-cols-1 gap-6">
                    <input
                        className="border border-gray-600 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Enter the Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        className="border border-gray-600 bg-gray-700 text-white p-3 rounded-lg h-40 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Write your content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    
                    {/* Post Button */}
                    <button
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 transition-all duration-300"
                        onClick={PostIt}
                    >
                        Post Blog
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

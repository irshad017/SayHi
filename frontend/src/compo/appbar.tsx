import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { PlusIcon, UserMinusIcon } from '@heroicons/react/24/solid'; // Import ChatIcon
import { FaIcons } from "react-icons/fa";
import { Avatar } from "./Avatar";

export const Appbar = () => {
    const [isCreatePostTooltipVisible, setIsCreatePostTooltipVisible] = useState(false);
    const [isMyBlogsTooltipVisible, setIsMyBlogsTooltipVisible] = useState(false);
    const [isLogoutTooltipVisible, setIsLogoutTooltipVisible] = useState(false);
    const [isChatTooltipVisible, setIsChatTooltipVisible] = useState(false); // State for chat tooltip
    const navigate = useNavigate();
    const userName = localStorage.getItem("username") || "User"

    const handleOut = async () => {
        localStorage.clear();
        navigate('/');
    };
    
    return (
        <header className="border-b p-4 bg-gray-800 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo or Title with Icon */}
                <div className="flex items-center text-2xl font-bold text-white">
                    <AcademicCapIcon className="h-8 w-8 mr-2" />
                    Medium
                </div>

                {/* Avatar and Button Section */}
                <div className="flex items-center space-x-4 relative">
                    {/* Chat Icon Button */}
                    
                    <Link to={'/chatRoom'}>
                        <button
                            className="relative bg-gray-600 text-white rounded-full p-2 transition-all duration-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                            onMouseEnter={() => setIsChatTooltipVisible(true)} 
                            onMouseLeave={() => setIsChatTooltipVisible(false)}
                            aria-label="Chat with Users"
                        >
                            
                            <FaIcons className="h-6 w-6"></FaIcons>
                            {isChatTooltipVisible && (
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 mt-1 w-28 p-1 bg-gray-700 text-white text-center rounded-md shadow-lg">
                                    Chat with Users
                                </div>
                            )}
                        </button>
                    </Link>

                    {/* Make a Post Icon Button */}
                    <Link to={'/createNew'} className="relative">
                        <button 
                            className="bg-blue-600 text-white rounded-full p-2 transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                            aria-label="Create New Post"
                            onMouseEnter={() => setIsCreatePostTooltipVisible(true)} 
                            onMouseLeave={() => setIsCreatePostTooltipVisible(false)}
                        >
                            <PlusIcon className="h-6 w-6" />
                        </button>
                        {isCreatePostTooltipVisible && (
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 mt-1 w-24 p-1 bg-gray-700 text-white text-center rounded-md shadow-lg">
                                Create Post
                            </div>
                        )}
                    </Link>

                    {/* My Blogs Link */}
                    <Link to={'/myblogs'} className="relative" 
                        onMouseEnter={() => setIsMyBlogsTooltipVisible(true)} 
                        onMouseLeave={() => setIsMyBlogsTooltipVisible(false)}>
                        <div className="rounded-full border-2 border-gray-500 p-1">
                            <Avatar name={userName} size="big" />
                        </div>
                        {isMyBlogsTooltipVisible && (
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 mt-1 w-20 p-1 bg-gray-700 text-white text-center rounded-md shadow-lg">
                                My Blogs
                            </div>
                        )}
                    </Link>

                    {/* Logout Icon Button */}
                    <button
                        onClick={handleOut}
                        className="relative bg-gray-600 text-white rounded-full p-2 transition-all duration-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                        onMouseEnter={() => setIsLogoutTooltipVisible(true)} 
                        onMouseLeave={() => setIsLogoutTooltipVisible(false)}
                        aria-label="Logout"
                    >
                        <UserMinusIcon className="h-6 w-6" />
                        {isLogoutTooltipVisible && (
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 mt-1 w-20 p-1 bg-gray-700 text-white text-center rounded-md shadow-lg">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

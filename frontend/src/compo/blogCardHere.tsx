import React from 'react';
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Link } from "react-router-dom";
import { Avatar } from './Avatar';
// import { ConfirmationModal } from "./ConfirmationModal"; // Import the ConfirmationModal

interface BlogsCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
    onDelete: (id: number) => void;
}

export const BlogsCardHere = ({
    authorName,
    title,
    content,
    publishedDate,
    id,
    onDelete
}: BlogsCardProps) => {
    const [showModal, setShowModal] = useState(false);

    const GetDelete = async () => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            toast.success("Deleted blog with ID: " + id);
            onDelete(id);
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog with ID: " + id);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 transition duration-300 ease-in-out hover:shadow-lg">
            <Link to={`/getblogs/${id}`}>
                <div className="flex items-center mb-2">
                    <Avatar name={authorName || "User"} size="small" />
                    <div className="ml-2">
                        <span className="font-semibold text-white">{authorName || "User"}</span>
                        <span className="block text-gray-400 text-sm">{publishedDate || "No Date"}</span>
                    </div>
                </div>
                <h2 className="text-lg font-bold text-white">{title || "Untitled"}</h2>
                <p className="text-gray-300">{content.slice(0, 100) + "..." || "No Content"}</p>
                <div className="text-gray-500 text-sm mb-2">
                    {`${Math.ceil(content.length / 100)} minute(s) read`}
                </div>
            </Link>
            <button
                onClick={() => setShowModal(true)} // Show the confirmation modal
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition duration-200"
            >
                Delete
            </button>
            <Toaster />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    GetDelete();
                    setShowModal(false); // Close the modal after confirming
                }}
            />
        </div>
    );
};



interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md transition-all duration-300">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Deletion</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this blog? This action cannot be undone.
                </p>
                <div className="flex justify-between">
                    <button 
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@irshad017/medium-comman";
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast, { Toaster } from "react-hot-toast";
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export const AUth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    // SEND REQUEST -------
    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            const jwt = response.data.token;
            const username = response.data.username;
            const id = response.data.id;
            console.log(response.data.message)
            toast.success(`${response.data.message}`)
            localStorage.setItem("token", jwt);
            localStorage.setItem("username", username);
            localStorage.setItem("UserId", id);
            navigate('/blogs');
        } catch (err: any) {
            console.log("AXIOS ERROR: ", err.response.data.message);
            toast.error(`${err.response.data.message}`)
        }
    }

    return (
        <div>
            <Navbar />
            <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
                <div className="bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white">
                            {type === "signup" ? "Create an Account" : "Sign In"}
                        </h2>
                        <p className="text-gray-400 mt-2">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <Link className="pl-2 underline text-blue-400" to={type === "signin" ? "/signup" : "/"}>
                                {type === "signin" ? "Sign Up" : "Sign In"}
                            </Link>
                        </p>
                    </div>
                    {/* INPUTS */}
                    <div className="mt-6">
                        {type === "signup" && (
                            <LabelledInput label="Name" placeholder="Your Name" onchange={(e) => {
                                setPostInputs({ ...postInputs, name: e.target.value });
                            }} />
                        )}
                        <LabelledInput label="Username" placeholder="you@example.com" onchange={(e) => {
                            setPostInputs({ ...postInputs, username: e.target.value });
                        }} />
                        <LabelledInput label="Password" type="password" placeholder="••••••••" onchange={(e) => {
                            setPostInputs({ ...postInputs, password: e.target.value });
                        }} />
                        <button
                            onClick={sendRequest}
                            type="button"
                            className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors">
                            {type === "signup" ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </div>
                <Toaster/>
            </div>
        </div>
    );
};
interface LabelledInputTypes {
    label: string;
    placeholder: string;
    onchange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function LabelledInput({ label, placeholder, onchange, type }: LabelledInputTypes) {
    return (
        <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-300">
                {label}
            </label>
            <input
                type={type || "text"}
                onChange={onchange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
export const Navbar = () => {    
    return (
        <header className="border-b px-4 py-3 bg-gray-800 shadow-md">
            <div className="container mx-auto flex items-center justify-between flex-wrap">
                {/* Logo or Title with Icon */}
                <div className="flex items-center text-2xl font-bold text-white space-x-2">
                    <AcademicCapIcon className="h-8 w-8" />
                    <span className="text-lg font-semibold">Medium</span>
                </div>

                {/* Tagline */}
                <div className=" text-gray-200 text-sm sm:text-lg">
                    A Thoughtful Blogging Experience
                </div>
            </div>
        </header>
    );
};











import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

interface BlogsCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
}

export const BlogsCard = ({
    authorName,
    title,
    content,
    publishedDate,
    id,
}: BlogsCardProps) => {
    return (
        <Link to={`/getblogs/${id}`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 pb-4 w-full max-w-screen-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-lg mx-auto">
                <div className="flex items-center mb-2">
                    <Avatar name={authorName} size="small" />
                    <div className="ml-2 text-sm font-light text-gray-600 dark:text-gray-400">
                        {authorName}
                    </div>
                    <div className="ml-2">
                        <Circle />
                    </div>
                    <div className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                        {publishedDate}
                    </div>
                </div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {title}
                </div>
                <div className="text-sm font-light text-gray-600 dark:text-gray-400">
                    {content.slice(0, 100) + "..."}
                </div>
                <div className="text-slate-400 text-sm font-light mt-1">
                    {`${Math.ceil(content.length / 100)} minute(s) read`}
                </div>
            </div>
        </Link>
    );
};

function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500 dark:bg-slate-300"></div>;
}

// export function Avatar({ name, size = "small" }: { name: string; size: "small" | "big" }) {
//     return (
//         <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-8 h-8" : "w-10 h-10"} overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-full`}>
//             <span className={`text-${size === "small" ? "xs" : "md"} font-light text-gray-600 dark:text-gray-300`}>
//                 {name[0]}
//             </span>
//         </div>
//     );
// }

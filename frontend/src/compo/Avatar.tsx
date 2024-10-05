export function Avatar({ name, size = "small" }: { name: string; size: "small" | "big" }) {
    const textSizeClass = size === "small" ? "text-xs" : "text-md";
    return (
        <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-8 h-8" : "w-10 h-10"} overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-full`}>
            <span className={`${textSizeClass} font-light text-gray-600 dark:text-gray-300`}>
                {name[0]}
            </span>
        </div>
    );
}

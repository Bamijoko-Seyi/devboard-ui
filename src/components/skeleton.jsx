export function SkeletonLine({ className = "" }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function ProjectCardSkeleton() {
    return (
        <div className="bg-white p-5 rounded shadow">
            <SkeletonLine className="h-5 w-2/3 mb-3" />
            <SkeletonLine className="h-4 w-full mb-2" />
            <SkeletonLine className="h-3 w-1/3" />
        </div>
    );
}

export function TaskCardSkeleton() {
    return (
        <div className="bg-white p-3 rounded shadow-sm">
            <SkeletonLine className="h-4 w-3/4 mb-2" />
            <SkeletonLine className="h-3 w-full" />
        </div>
    );
}
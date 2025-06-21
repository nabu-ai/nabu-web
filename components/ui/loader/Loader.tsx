type LoaderProps = {};

export const Loader = ({ }: LoaderProps) => {
    return (
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="h-20 w-20 animate-spin rounded-full border-4 dark:border-b-white border-blue-700 border-b-transparent transition-opacity duration-500"></div>
        </div>
    );
};

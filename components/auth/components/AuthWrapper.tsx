import React from 'react'

export default function AuthWrapper({
    children,
    bannerHeading,
    bannerDescription,
    heading,
    description
}: {
    children: React.ReactNode;
    bannerHeading: string;
    bannerDescription: string;
    heading: string;
    description: string;
}) {
    return (
        <>
            <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
                <div className="relative items-center justify-center  flex z-1">
                    <div className="hidden lg:block lg:w-1/2">
                        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                            <div className="space-y-6">
                                <a href="/nabu-web/" >
                                    <img className="h-20 my-10" src="/nabu-web/Nabu-Logo.png"></img>
                                </a>
                                <div className="space-y-2">
                                    <h1 className="text-5xl font-medium text-white/60" >{bannerHeading}</h1>
                                    <p className="text-title-xs text-white/60">{bannerDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-auto px-4 ">
                <div className="flex flex-col justify-center flex-1 w-full max-w-lg mx-auto">
                    <div className="p-4 rounded-4xl border-2 border-blue-500 shadow-lg">

                        <div className="mb-2 sm:mb-6">
                            <h1 className="pt-2 pb-2 font-semibold text-gray-900 text-title-md dark:text-white/90 text-center">
                                {heading}
                            </h1>
                            <p className="text-theme-xl text-gray-500 dark:text-gry-400">
                                {description}
                            </p>
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

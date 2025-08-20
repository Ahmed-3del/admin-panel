import Image from "next/image"

import { Code, Zap } from "lucide-react"

export function Loader() {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="flex  items-center justify-center w-20 h-20 rounded-2xl  shadow-lg">
                        <Image
                            src="/assets/logo/abwabdigital-logo.png"
                            alt="Abwab Digital Logo"
                            width={200}
                            height={200}
                            className="absolute size-full p-3 inset-0 object-contain object-center rounded-2xl"
                        />
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-4 border-blue-200 animate-ping"></div>
                    <div className="absolute inset-0 rounded-2xl border-4 border-blue-400 animate-pulse"></div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r  bg-clip-text">
                        Abwab Digital
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium tracking-wide">SOFTWARE SOLUTIONS</p>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>

                <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                </div>

                <div className="absolute top-1/4 left-1/4 opacity-20">
                    <Zap className="w-6 h-6 text-blue-500 animate-bounce [animation-delay:-0.5s]" />
                </div>
                <div className="absolute top-1/3 right-1/4 opacity-20">
                    <Code className="w-4 h-4 text-purple-500 animate-bounce [animation-delay:-0.7s]" />
                </div>
                <div className="absolute bottom-1/3 left-1/3 opacity-20">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping [animation-delay:-0.9s]"></div>
                </div>
                <div className="absolute bottom-1/4 right-1/3 opacity-20">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-1.1s]"></div>
                </div>
            </div>
        </div>
    )
}

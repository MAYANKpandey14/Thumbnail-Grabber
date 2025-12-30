
import { DotScreenShader } from "@/components/ui/dot-shader-background";

export default function Demo() {
    return (
        <div className="h-screen w-screen flex flex-col gap-8 items-center justify-center relative bg-background overflow-hidden">
            <div className="absolute inset-0 z-0">
                <DotScreenShader />
            </div>
            <div className="z-10 flex flex-col items-center gap-4">
                <h1 className="text-6xl md:text-7xl font-light tracking-tight mix-blend-difference text-white whitespace-nowrap pointer-events-none">
                    DIGITAL INNOVATION
                </h1>
                <p className="text-lg md:text-xl font-light text-center text-white mix-blend-difference max-w-2xl leading-relaxed pointer-events-none">
                    Where thoughts take shape and consciousness flows like liquid mercury through infinite dimensions.
                </p>
            </div>
        </div>
    );
}

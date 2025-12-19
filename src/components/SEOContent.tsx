import React from 'react';
import { CheckCircle2, Monitor, Smartphone, Zap, Download, Youtube } from 'lucide-react';

export default function SEOContent() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-12 text-foreground/90">

            {/* Introduction */}
            <section className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">YouTube Thumbnail Downloader - 4K Quality</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                    YouTube Thumbnail Downloader is a free, automated online tool that allows you to download YouTube video thumbnails
                    in up to 5 different qualities: <strong>Full HD (1280x720), Standard (640x480), Medium (480x360), Normal (320x180), and Small (120x90)</strong>.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                    Whether you need a quick preview or a high-quality image for your project, our tool instantly grabs thumbnails
                    without requiring any software installation. It's completely free and compatible with all devices.
                </p>
            </section>

            {/* What is a Thumbnail */}
            <section className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <Youtube className="w-6 h-6 text-primary" />
                    What is a Custom Thumbnail?
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                    A thumbnail is a reduced-size version of an image or video, designed to serve as a preview. On YouTube,
                    it acts as the "book cover" for your video. It's the first thing potential viewers see and plays a crucial role
                    in their decision to click and watch.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                    In today's visual-first world, a compelling thumbnail captures attention, sets the tone for your content,
                    and significantly boosts click-through rates (CTR). A high-quality, engaging thumbnail allows creators to
                    stand out in a crowded feed and drive more traffic to their channel.
                </p>
            </section>

            {/* Available Sizes */}
            <section className="space-y-6">
                <h3 className="text-2xl font-semibold">Available YouTube Thumbnail Sizes</h3>
                <p className="text-muted-foreground">
                    YouTube automatically generates multiple sizes for every uploaded video. Our downloader lets you access all of them:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/30 p-6 rounded-xl border">
                        <h4 className="font-semibold mb-4 text-primary">Primary Resolutions</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>Maximum Resolution (HD)</span>
                                <span className="font-mono text-muted-foreground">1280 x 720</span>
                            </li>
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>Standard Definition (SD)</span>
                                <span className="font-mono text-muted-foreground">640 x 480</span>
                            </li>
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>High Quality (HQ)</span>
                                <span className="font-mono text-muted-foreground">480 x 360</span>
                            </li>
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>Medium Quality (MQ)</span>
                                <span className="font-mono text-muted-foreground">320 x 180</span>
                            </li>
                            <li className="flex justify-between pb-2">
                                <span>Default / Small</span>
                                <span className="font-mono text-muted-foreground">120 x 90</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-xl border">
                        <h4 className="font-semibold mb-4 text-primary">Hidden Generated Sizes</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>Player Background</span>
                                <span className="font-mono text-muted-foreground">480 x 360</span>
                            </li>
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>Start Frame</span>
                                <span className="font-mono text-muted-foreground">120 x 90</span>
                            </li>
                            <li className="flex justify-between border-b border-border/50 pb-2">
                                <span>Middle Frame</span>
                                <span className="font-mono text-muted-foreground">120 x 90</span>
                            </li>
                            <li className="flex justify-between pb-2">
                                <span>End Frame</span>
                                <span className="font-mono text-muted-foreground">120 x 90</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* How to get URL */}
            <section className="space-y-6">
                <h3 className="text-2xl font-semibold">How to Copy a YouTube Video Link</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-medium text-lg">
                            <Monitor className="w-5 h-5" />
                            Desktop / PC
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                            <li>Navigate to the video you want to download.</li>
                            <li>Running <strong>Address Bar</strong>: Copy the URL directly from the browser's address bar.</li>
                            <li><strong>Right Click</strong>: Right-click the video or title and select "Copy link address".</li>
                            <li><strong>Share Button</strong>: Click "Share" below the video and copy the provided link.</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-medium text-lg">
                            <Smartphone className="w-5 h-5" />
                            Mobile App
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                            <li>Open the YouTube app and play the video.</li>
                            <li>Tap the <strong>Share</strong> arrow icon.</li>
                            <li>Select <strong>Copy link</strong> from the menu.</li>
                            <li>Paste the link into our search box above.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Valid URL Formats */}
            <section className="bg-muted/30 p-6 rounded-xl border border-dashed">
                <h3 className="font-semibold mb-4">Supported URL Formats</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Our tool supports all standard YouTube link formats, including Shorts:
                </p>
                <div className="space-y-2 font-mono text-xs md:text-sm text-muted-foreground bg-background p-4 rounded-lg border">
                    <p>https://www.youtube.com/watch?v=BlGwuM_S2SQ</p>
                    <p>https://youtu.be/BlGwuM_S2SQ</p>
                    <p>https://www.youtube.com/embed/BlGwuM_S2SQ</p>
                    <p>https://youtube.com/shorts/Go32DIDYRns</p>
                </div>
            </section>

            {/* Features */}
            <section className="space-y-6">
                <h3 className="text-2xl font-semibold">Why Use Our Thumbnail Grabber?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-card border shadow-sm">
                        <Zap className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-semibold mb-2">Instant Preview</h4>
                        <p className="text-sm text-muted-foreground">
                            Paste the link and immediately see previews of all available sizes before downloading.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border shadow-sm">
                        <Download className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-semibold mb-2">Single Click Download</h4>
                        <p className="text-sm text-muted-foreground">
                            Save any thumbnail directly to your device with a simple click. No right-click hassle.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border shadow-sm">
                        <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-semibold mb-2">Shorts Support</h4>
                        <p className="text-sm text-muted-foreground">
                            Full support for YouTube Shorts videos, essential for modern content creators.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ / Info */}
            <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Common Questions</h3>
                <div className="space-y-6 text-muted-foreground">
                    <div>
                        <h4 className="font-medium text-foreground mb-2">What is the best size for YouTube Thumbnails?</h4>
                        <p>
                            YouTube recommends a resolution of <strong>1280x720</strong> (minimum width of 640 pixels).
                            Aspect ratio should be 16:9, and the file size should be under 2MB.
                            Supported formats include JPG, GIF, and PNG.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-foreground mb-2">Can I download legally?</h4>
                        <p>
                            Thumbnails are generally used for fair use, inspiration, or archival purposes.
                            Always respect copyright laws and the creator's rights when using downloaded content.
                            This tool is popular among designers, bloggers, and creators for referencing trends.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}

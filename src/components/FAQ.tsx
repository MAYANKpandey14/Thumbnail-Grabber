"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    const faqs = [
        {
            question: "Is it legal to download YouTube thumbnails?",
            answer: "Yes, downloading thumbnails for personal use or reference is generally considered acceptable. However, you should respect copyright laws and not use the images for commercial purposes without permission from the content owner.",
        },
        {
            question: "What is the highest quality thumbnail available?",
            answer: "The highest quality available is typically 'MaxRes' (1280x720). However, not all videos have a MaxRes thumbnail, in which case the tool will provide the highest quality available.",
        },
        {
            question: "Can I download thumbnails from private videos?",
            answer: "No, this tool only works with public YouTube videos. Private or unlisted videos may not work if their metadata is not accessible.",
        },
        {
            question: "Is this service free?",
            answer: "Yes, this tool is completely free to use for grabbing high-quality thumbnails.",
        },
        {
            question: "How do I download multiple thumbnails at once?",
            answer: "You can use the 'Bulk Mode' feature. Simply paste multiple YouTube URLs (one per line) or upload a CSV file containing the URLs to download them in a single batch.",
        },
    ];

    return (
        <section className="w-full max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}

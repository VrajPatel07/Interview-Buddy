"use client";

import { useState } from "react";
import { Mail, FileText, User, Star, ExternalLink, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";


type SessionWithDetails = {
    id: string;
    totalScore: number | null;
    resumeUrl: string | null;
    createdAt: Date;
    candidate: {
        name: string;
        email: string;
        avatar: string | null;
    };
    questions: {
        id: string;
        content: string;
        answerText: string | null;
        difficulty: string;
    }[];
};



interface JobDashboardProps {
    jobTitle: string;
    jobDescription: string;
    sessions: SessionWithDetails[];
}


const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-zinc-800 text-zinc-400 border-zinc-700";
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 50) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
};



export default function JobDashboard({ jobTitle, jobDescription, sessions }: JobDashboardProps) {


    const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const handleCardClick = (session: SessionWithDetails) => {
        setSelectedSession(session);
        setIsDialogOpen(true);
    };


    const filteredSessions = sessions.filter((session) => {

        if (!searchQuery) return true;

        const query = searchQuery.trim().toLowerCase();

        const isNumericQuery = !isNaN(Number(query)) && query !== "";

        if (isNumericQuery) {
            const score = session.totalScore || 0;
            return score >= Number(query);
        }
        else {
            return (
                session.candidate.name.toLowerCase().includes(query) ||
                session.candidate.email.toLowerCase().includes(query)
            );
        }

    });


    const handleDownloadPDF = () => {

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(`Candidate Report: ${jobTitle}`, 14, 20);

        // Subtitle / Date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
        doc.text(`Filter Criteria: ${searchQuery ? `"${searchQuery}"` : "All Candidates"}`, 14, 33);

        // Prepare Data for Table
        const tableData = filteredSessions.map((session) => [
            session.candidate.name,
            session.candidate.email,
            session.totalScore ? session.totalScore.toString() : "N/A",
            session.resumeUrl ? session.resumeUrl : "No Resume",
        ]);

        // Generate Table
        autoTable(doc, {
            startY: 40,
            head: [["Name", "Email", "Total Score", "Resume Link"]],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [0, 0, 0] }, // Black header
            columnStyles: {
                0: { cellWidth: 40 }, // Name
                1: { cellWidth: 60 }, // Email
                2: { cellWidth: 30, halign: 'center' }, // Score
                3: { cellWidth: 'auto' }, // Resume
            }
        });

        // Save File
        doc.save(`${jobTitle.replace(/\s+/g, '_')}_Candidates.pdf`);

    };


    return (
        <div className="space-y-6 p-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{jobTitle}</h1>
                </div>
            </div>

            <Separator />

            <div className="w-full space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">

                    <div className="w-full sm:max-w-md relative">
                        <Command shouldFilter={false} className="rounded-lg border shadow-sm z-10 overflow-visible">
                            <CommandInput
                                placeholder="Search name, email, or min score (e.g. 75)..."
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                className="border-none focus:ring-0"
                            />
                        </Command>
                    </div>

                    <Button
                        onClick={handleDownloadPDF}
                        disabled={filteredSessions.length === 0}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>

                </div>

                <div className="rounded-lg border shadow-sm p-4 min-h-[50vh]">
                    {filteredSessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <p>No candidates found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSessions.map((session) => (
                                <Card
                                    key={session.id}
                                    onClick={() => handleCardClick(session)}
                                    className="w-full cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-primary/20"
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg flex items-center gap-2 truncate">
                                                <User className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{session.candidate.name}</span>
                                            </CardTitle>
                                            {session.totalScore !== null && (
                                                <Badge variant={session.totalScore >= 75 ? "default" : "secondary"} className="shrink-0">
                                                    {session.totalScore}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="flex items-center gap-2 truncate">
                                            <Mail className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{session.candidate.email}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {session.resumeUrl ? (
                                                <a
                                                    href={session.resumeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 w-fit"
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    View Resume
                                                </a>
                                            ) : (
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <FileText className="h-3 w-3" /> No Resume
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Interview Details</DialogTitle>
                        <DialogDescription>
                            Reviewing session for <span className="font-semibold text-foreground">{selectedSession?.candidate.name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSession && (
                        <div className="mt-4 space-y-4">
                            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="font-medium">Total Score: {selectedSession.totalScore ?? "N/A"}</span>
                                </div>
                                {selectedSession.resumeUrl && (
                                    <a href={selectedSession.resumeUrl} target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                                        <ExternalLink className="h-4 w-4" /> View Resume
                                    </a>
                                )}
                            </div>

                            <h3 className="text-lg font-semibold mt-6">Q&A Transcript</h3>

                            <Accordion type="single" collapsible className="w-full">
                                {selectedSession.questions.length > 0 ? (
                                    selectedSession.questions.map((q, index) => (
                                        <AccordionItem key={q.id} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left hover:no-underline hover:bg-muted/50 px-2 rounded">
                                                <div className="flex gap-2">
                                                    <span className="font-bold text-muted-foreground">Q{index + 1}.</span>
                                                    <span className="text-muted-foreground text-lg max-h-32 overflow-y-auto wrap-break-word">{q.content}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4 bg-muted/20 rounded-b text-base whitespace-pre-wrap">
                                                {q.answerText ? (
                                                    <div className="text-muted-foreground text-lg max-h-32 overflow-y-auto wrap-break-word">
                                                        {q.answerText}
                                                    </div>
                                                ) : (
                                                    <span className="italic text-muted-foreground">No answer provided.</span>
                                                )}
                                                <div className="mt-2 flex gap-2">
                                                    <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted-foreground">No questions recorded for this session.</div>
                                )}
                            </Accordion>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}
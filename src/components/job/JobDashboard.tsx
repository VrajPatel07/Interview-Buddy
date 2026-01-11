"use client";

import { useState } from "react";
import { Mail, FileText, User, Star, ExternalLink, Download, Search, Briefcase } from "lucide-react";

import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
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



export default function JobDashboard({ jobTitle, sessions }: JobDashboardProps) {

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
        <div className="min-h-screen w-full bg-zinc-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-10 space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
                            <Briefcase className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">{jobTitle}</h1>
                            <p className="text-zinc-400 text-sm mt-1">
                                {sessions.length} {sessions.length === 1 ? 'candidate' : 'candidates'} interviewed
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent" />
                </div>

                {/* Search and Download Section */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors z-10" />
                        <Command
                            shouldFilter={false}
                            className="rounded-lg border shadow-sm z-10 overflow-visible border-zinc-800 bg-zinc-900/50 backdrop-blur-xl hover:border-zinc-700 transition-colors"
                        >
                            <CommandInput
                                placeholder="Search by name, email, or minimum score (e.g., 75)..."
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                className="border-none focus:ring-0 pl-11 text-zinc-100 placeholder:text-zinc-600 h-12"
                            />
                        </Command>
                    </div>

                    <Button
                        onClick={handleDownloadPDF}
                        disabled={filteredSessions.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-12 px-6 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>

                {/* Candidates Grid */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-xl shadow-2xl p-6 min-h-[60vh]">
                    {filteredSessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-100 text-zinc-500">
                            <User className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No candidates found</p>
                            <p className="text-sm text-zinc-600 mt-1">Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSessions.map((session) => (
                                <Card
                                    key={session.id}
                                    onClick={() => handleCardClick(session)}
                                    className="group cursor-pointer bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)] hover:scale-[1.02] backdrop-blur-sm overflow-hidden"
                                >
                                    <CardHeader className="pb-3 bg-linear-to-br from-zinc-900/80 to-zinc-900/40 border-b border-zinc-800/50">
                                        <div className="flex justify-between items-start gap-3">
                                            <CardTitle className="text-lg flex items-center gap-2 truncate text-white group-hover:text-indigo-300 transition-colors">
                                                <div className="p-1.5 bg-zinc-800/80 rounded-lg shrink-0">
                                                    <User className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <span className="truncate">{session.candidate.name}</span>
                                            </CardTitle>
                                            {session.totalScore !== null && (
                                                <Badge
                                                    className={cn(
                                                        "shrink-0 font-semibold text-sm px-2.5 py-1",
                                                        getScoreColor(session.totalScore)
                                                    )}
                                                >
                                                    {session.totalScore}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="flex items-center gap-2 truncate text-zinc-400 mt-2">
                                            <Mail className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{session.candidate.email}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-center gap-2">
                                            {session.resumeUrl ? (
                                                <a
                                                    href={session.resumeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 transition-colors group/link"
                                                >
                                                    <FileText className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                                                    View Resume
                                                    <ExternalLink className="h-3 w-3 opacity-60" />
                                                </a>
                                            ) : (
                                                <span className="text-sm text-zinc-500 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    No Resume
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

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader className="pb-4 border-b border-zinc-800/50">
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/20">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            Interview Details
                        </DialogTitle>
                        <DialogDescription className="text-sm text-zinc-400 mt-2">
                            Reviewing session for{" "}
                            <span className="font-semibold text-indigo-300">
                                {selectedSession?.candidate.name}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {selectedSession && (
                            <div className="mt-6 space-y-6 pb-4">
                                {/* Summary Card */}
                                <div className="flex flex-wrap items-center gap-4 p-5 bg-zinc-950/50 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                                            <Star className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 font-medium">Total Score</div>
                                            <div className="text-2xl font-bold text-white">
                                                {selectedSession.totalScore ?? "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedSession.resumeUrl && (
                                        <a
                                            href={selectedSession.resumeUrl}
                                            target="_blank"
                                            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-auto group"
                                        >
                                            <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                            View Resume
                                        </a>
                                    )}
                                </div>

                                {/* Q&A Section */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                                        Q&A Transcript
                                    </h3>

                                    <Accordion type="single" collapsible className="w-full space-y-3">
                                        {selectedSession.questions.length > 0 ? (
                                            selectedSession.questions.map((q, index) => (
                                                <AccordionItem
                                                    key={q.id}
                                                    value={`item-${index}`}
                                                    className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-700 transition-colors"
                                                >
                                                    <AccordionTrigger className="px-5 py-4 text-left hover:no-underline hover:bg-zinc-900/50 transition-colors group">
                                                        <div className="flex gap-3 w-full">
                                                            <span className="font-bold text-indigo-400 shrink-0 text-sm">
                                                                Q{index + 1}.
                                                            </span>
                                                            <span className="text-muted-foreground wrap-break-word break-all text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                                {q.content}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>

                                                    <AccordionContent className="px-5 py-4 bg-zinc-950/30 border-t border-zinc-800/50">
                                                        <div className="space-y-4">
                                                            {q.answerText ? (
                                                                <div className="text-muted-foreground wrap-break-word break-all text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                                    {q.answerText}
                                                                </div>
                                                            ) : (
                                                                <span className="italic text-zinc-600 text-sm">
                                                                    No answer provided.
                                                                </span>
                                                            )}

                                                            <div className="flex gap-2 pt-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-zinc-900/50 border-zinc-700 text-zinc-300"
                                                                >
                                                                    {q.difficulty}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                <p className="font-medium">No questions recorded for this session.</p>
                                            </div>
                                        )}
                                    </Accordion>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
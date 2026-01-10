import { getCandidateInterviews } from "@/components/profile/actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, FileText, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";



const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
        case "COMPLETED" : return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
        case "IN_PROGRESS":
        case "WAITING" : return "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20";
        default : return "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700";
    }
};



const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
        case "COMPLETED": return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
        case "IN_PROGRESS": return <Clock className="w-3.5 h-3.5 mr-1.5" />;
        default: return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
    }
};


export default async function CandidateInterviews() {

    const interviewSessions = await getCandidateInterviews();

    return (
        <section className="min-h-screen w-full bg-zinc-950 relative overflow-hidden px-4 py-12">

            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute left-0 top-0 w-125 h-125 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-125 h-125 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto space-y-8">

                <header className="space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-indigo-500" />
                        My Interviews
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Track your application progress and review past interview feedback.
                    </p>
                </header>

                <main>
                    {interviewSessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <Briefcase className="w-8 h-8 text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-medium text-white">No interviews yet</h3>
                            <p className="text-zinc-500 mt-2 text-center max-w-sm">
                                You haven't participated in any interviews yet. Apply for jobs to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {interviewSessions.map((session) => (

                                <Dialog key={session.id}>

                                    <DialogTrigger asChild>
                                        <Card className="group cursor-pointer border-zinc-800 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900/80 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg">
                                                        <Building2 className="w-5 h-5 text-indigo-400" />
                                                    </div>
                                                    <Badge variant="outline" className={cn("transition-colors", getStatusStyles(session.status))}>
                                                        {getStatusIcon(session.status)}
                                                        {session.status}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg text-zinc-100 mt-4 line-clamp-1">
                                                    {session.job.title}
                                                </CardTitle>
                                                <CardDescription className="text-zinc-400 flex items-center gap-1">
                                                    {session.job.company.name}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </DialogTrigger>

                                    <DialogContent className="max-w-2xl max-h-[85vh] bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">

                                        <DialogHeader className="p-6 pb-2 border-b border-zinc-800/50 bg-zinc-900/50">
                                            <DialogTitle className="text-xl flex items-center gap-2">
                                                {session.job.title}
                                                <Badge variant="outline" className={cn("ml-2 text-xs font-normal", getStatusStyles(session.status))}>
                                                    {session.status}
                                                </Badge>
                                            </DialogTitle>
                                            <DialogDescription className="text-zinc-400 flex items-center gap-2">
                                                <Building2 className="w-4 h-4" /> {session.job.company.name}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <ScrollArea className="h-full max-h-[60vh] px-6 py-4">
                                            <div className="space-y-8">
                                                {/* Job Description */}
                                                <section className="space-y-3">
                                                    <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-indigo-400" />
                                                        Job Description
                                                    </h3>
                                                    <ScrollArea className="h-auto max-h-48 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                                        <div className="p-4 text-sm text-zinc-400 leading-relaxed">
                                                            {session.job.description}
                                                        </div>
                                                    </ScrollArea>
                                                </section>

                                                {/* Q&A Section */}
                                                <section className="space-y-3">
                                                    <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                                                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                                                        Interview Q&A
                                                    </h3>
                                                    <Accordion type="single" collapsible className="w-full">
                                                        {session.questions.map((question, index) => (
                                                            <AccordionItem key={question.id} value={question.id} className="border-zinc-800">
                                                                <AccordionTrigger className="text-sm text-zinc-300 hover:text-indigo-400 hover:no-underline py-3 items-start">
                                                                    <span className="flex gap-2 text-left pr-4">
                                                                        <span className="text-zinc-500 font-mono shrink-0">{(index + 1).toString().padStart(2, '0')}.</span>
                                                                        <span className="wrap-break-words">{question.content}</span>
                                                                    </span>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="bg-zinc-900/30 rounded-md p-4 mb-2 border border-zinc-800/50">
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <span className="text-xs font-medium text-indigo-400 block mb-1">Your Answer:</span>
                                                                            <ScrollArea className="h-auto max-h-32">
                                                                                <p className="text-zinc-300 text-sm leading-relaxed pr-4">
                                                                                    {question.answerText || <span className="text-zinc-600 italic">No answer recorded</span>}
                                                                                </p>
                                                                            </ScrollArea>
                                                                        </div>
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </section>

                                                {/* Feedback Section */}
                                                {session.feedback && (
                                                    <section className="space-y-3">
                                                        <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                            Feedback
                                                        </h3>
                                                        <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-lg p-4">
                                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                                {session.feedback}
                                                            </p>
                                                        </div>
                                                    </section>
                                                )}
                                            </div>
                                        </ScrollArea>

                                        <div className="p-2 border-t border-zinc-800/50 bg-zinc-900/50 flex justify-end gap-3">
                                            {session.resumeUrl && (
                                                <Button
                                                    asChild
                                                    className="bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] transition-all"
                                                >
                                                    <a href={session.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        View Resume
                                                    </a>
                                                </Button>
                                            )}
                                        </div>

                                    </DialogContent>

                                </Dialog>

                            ))}
                        </div>
                    )}
                </main>

            </div>
        </section>
    );
}
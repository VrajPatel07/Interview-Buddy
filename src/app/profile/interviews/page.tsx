import { getCandidateInterviews } from "@/components/profile/actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";



const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
        case "COMPLETED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
        case "IN_PROGRESS":
        case "WAITING": return "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20";
        default: return "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700";
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

                                    <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col bg-zinc-900 border-zinc-800 text-white">
                                        <DialogHeader className="pb-4 border-b border-zinc-800/50">
                                            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                                                {session.job.title}
                                                <Badge variant="outline" className={cn("ml-2 text-xs font-normal", getStatusStyles(session.status))}>
                                                    {session.status}
                                                </Badge>
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                                                    Q&A Transcript
                                                </h3>

                                                <Accordion type="single" collapsible className="w-full space-y-3">
                                                    {session.questions.length > 0 ? (
                                                        session.questions.map((q, index) => (
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
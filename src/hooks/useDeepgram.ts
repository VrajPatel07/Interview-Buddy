import { useState, useRef, useEffect, useCallback } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { toast } from "sonner";


export function useDeepgram() {
    
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    const deepgramConnectionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);


    const startListening = useCallback(async () => {

        try {

            // 1. Get Temp Token
            const response = await fetch("/api/deepgram");
            const { token } = await response.json();

            if (!token) throw new Error("Failed to get Deepgram token");

            // 2. Setup Microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // 3. Setup Deepgram Connection
            const deepgram = createClient({ accessToken: token });
            const connection = deepgram.listen.live({
                model: "nova-2",
                language: "en-US",
                smart_format: true,
                interim_results: true,
            });

            // 4. Handle Socket Events
            connection.on(LiveTranscriptionEvents.Open, () => {

                setIsListening(true);

                // Start MediaRecorder
                const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && connection.getReadyState() === 1) {
                        connection.send(event.data);
                    }
                };

                mediaRecorder.start(250); // Send chunks every 250ms

            });

            connection.on(LiveTranscriptionEvents.Transcript, (data) => {

                const received = data.channel.alternatives[0].transcript;

                if (received && data.is_final) {
                    // Append completed sentences
                    setTranscript((prev) => prev ? prev + " " + received : received);
                }

            });

            connection.on(LiveTranscriptionEvents.Close, () => {
                setIsListening(false);
            });

            deepgramConnectionRef.current = connection;

        } 
        catch (error) {
            toast.error("Microphone access failed. Please check permissions.");
        }

    }, []);


    const stopListening = useCallback(() => {

        // Clean up Recorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }

        // Clean up Stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Clean up Deepgram
        if (deepgramConnectionRef.current) {
            deepgramConnectionRef.current.finish();
            deepgramConnectionRef.current = null;
        }

        setIsListening(false);

    }, []);


    const resetTranscript = useCallback(() => {
        setTranscript("");
    }, []);
    

    // Cleanup on unmount
    useEffect(() => {
        return () => stopListening();
    }, [stopListening]);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript
    };
}
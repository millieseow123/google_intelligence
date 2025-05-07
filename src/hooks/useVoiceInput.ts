import { useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export const useVoiceInput = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition()

    const startListening = () => {
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
    }

    const stopListening = () => {
        SpeechRecognition.stopListening()
    }

    useEffect(() => {
        return () => {
            SpeechRecognition.abortListening()
        }
    }, [])

    return {
        transcript,
        listening,
        startListening,
        stopListening,
        resetTranscript,
        browserSupportsSpeechRecognition
    }
}

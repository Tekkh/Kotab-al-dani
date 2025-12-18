import { useState, useRef } from 'react';
import { Mic, Square, RefreshCw } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // بدء التسجيل
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = []; // تصفير البيانات القديمة

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // أو audio/mp4
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // تحويل الـ Blob إلى ملف File ليقبله السيرفر
        const file = new File([blob], "recitation.webm", { type: 'audio/webm' });
        onRecordingComplete(file);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // بدء العداد
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("خطأ في الوصول للميكروفون:", err);
      alert("الرجاء السماح بالوصول للميكروفون لتسجيل التلاوة.");
    }
  };

  // إيقاف التسجيل
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // إيقاف المايك
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // إعادة التسجيل (حذف الحالي)
  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    onRecordingComplete(null as any); // تصفير الملف في الأب
  };

  // تنسيق الوقت (00:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
      
      {/* 1. عداد الوقت */}
      <div className="text-2xl font-mono font-bold text-gray-700">
        {formatTime(recordingTime)}
      </div>

      {/* 2. أزرار التحكم */}
      {!audioUrl ? (
        // حالة التسجيل
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isRecording ? (
            <Square size={32} className="text-white fill-current" />
          ) : (
            <Mic size={32} className="text-white" />
          )}
        </button>
      ) : (
        // حالة ما بعد التسجيل (المراجعة)
        <div className="w-full flex flex-col items-center gap-4">
          <audio src={audioUrl} controls className="w-full h-10" />
          
          <button
            onClick={resetRecording}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            <span>إعادة التسجيل</span>
          </button>
        </div>
      )}

      {/* نص توضيحي */}
      <p className="text-xs text-gray-500">
        {isRecording ? "جارٍ التسجيل... اضغط للإيقاف" : audioUrl ? "استمع للتلاوة قبل الإرسال" : "اضغط الميكروفون للبدء"}
      </p>
    </div>
  );
}
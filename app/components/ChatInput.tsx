import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, Loader2, X, FileText } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFiles.length > 0) && !isLoading) {
      onSendMessage(message.trim(), selectedFiles[0] || undefined);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setSelectedFiles(prev => [...prev, audioFile]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-gray-800 bg-gray-900 pb-4 pt-2 px-0">
      {/* File tags as pills below input */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-2">
          {selectedFiles.map((file, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-sm text-gray-200 max-w-xs truncate shadow-sm"
            >
              {file.type.startsWith('image') ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-5 h-5 rounded object-cover" />
              ) : (
                <FileText size={16} className="text-purple-400" />
              )}
              <span className="truncate max-w-[7rem]">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="ml-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 p-0.5"
                tabIndex={-1}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="px-6">
        <div className="relative flex items-end">
          {/* Input box with icons inside */}
          <div className="flex-1">
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500 transition-shadow">
              {/* Attach icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mr-2 text-gray-400 hover:text-purple-400 focus:outline-none"
                tabIndex={0}
                aria-label="Attach file"
              >
                <Paperclip size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
                multiple
              />
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 resize-none focus:ring-0 focus:outline-none"
                rows={1}
                style={{ minHeight: '36px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              {/* Mic icon */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`ml-2 text-gray-400 hover:text-purple-400 focus:outline-none ${isRecording ? 'text-red-500' : ''}`}
                tabIndex={0}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              {/* Send button */}
              <button
                type="submit"
                disabled={(!message.trim() && selectedFiles.length === 0)}
                className="ml-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
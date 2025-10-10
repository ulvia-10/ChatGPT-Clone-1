import { useState } from "react";
import "./newPrompt.css";
import { useUploadFile } from "../../hooks/use-upload-file";

const NewPrompt = ({ setMessages, onSend }) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState(null);
  const uploadFileMutation = useUploadFile();

  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFilePath, setUploadedFilePath] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    if (file) {
      setUploadStatus("Uploading...");
      try {
        const result = await uploadFileMutation.mutateAsync(file);
        setUploadedFilePath(result.filePath);
        setUploadStatus("Upload berhasil!");
      } catch (error) {
        setUploadStatus("Upload gagal!");
      }
      setFile(null);
    }
    if (onSend && input.trim()) {
      onSend(input);
    }
    setInput("");
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser tidak mendukung Speech Recognition");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form className="newForm" onSubmit={handleSubmit}>
      <label htmlFor="file">
        <img src="/attachment.png" alt="attach" />
      </label>
      <input id="file" type="file" hidden onChange={handleFileChange} />
      {/* Feedback upload */}
      {uploadStatus && (
        <div style={{ color: uploadStatus === "Upload berhasil!" ? "green" : "red", marginLeft: 8 }}>
          {uploadStatus}
          {uploadedFilePath && (
            <span style={{ display: "block", fontSize: 12 }}>
              File URL: <a href={uploadedFilePath} target="_blank" rel="noopener noreferrer">{uploadedFilePath}</a>
            </span>
          )}
        </div>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
        style={{ marginRight: 8 }}
      />
      <button
        type="button"
        onClick={handleMicClick}
        style={{ background: isRecording ? '#fbbf24' : '#605e68', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 10, marginRight: 8 }}
        title={isRecording ? "Merekam..." : "Rekam suara"}
        disabled={isRecording}
      >
        {isRecording ? '🎤...' : '🎤'}
      </button>
      <button type="submit" disabled={!input.trim() && !file}>
        <img src="/arrow.png" alt="send" />
      </button>
    </form>
  );
};

export default NewPrompt;

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

export default function ExpertChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggestedDeadline, setSuggestedDeadline] = useState(null);

  const sendMessage = async () => {
    if (!input) return;
    setMessages((prev) => [...prev, { sender: "Kullanıcı", text: input }]);
    setInput("");
    try {
      const res = await axios.post("/api/abacus", { message: input });
      setMessages((prev) => [
        ...prev,
        { sender: "Uzman", text: res.data.response }
      ]);
      if (res.data.deadline) setSuggestedDeadline(res.data.deadline);
      else setSuggestedDeadline(null);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "Uzman", text: "Bir hata oluştu. Lütfen tekrar deneyin." }
      ]);
      setSuggestedDeadline(null);
    }
  };

  const addSuggestedDeadline = async () => {
    if (!suggestedDeadline) return;
    try {
      await axios.post("/api/deadlines", {
        title: suggestedDeadline.title,
        date: suggestedDeadline.date
      });
      setSuggestedDeadline(null);
      alert("Takvime eklendi!");
    } catch {
      alert("Takvime eklenirken bir hata oluştu.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Yatırımcı İlişkileri Uzman Chatbot
      </Typography>
      <Paper sx={{ minHeight: 200, p: 2, mb: 2 }}>
        {messages.map((m, i) => (
          <Typography
            key={i}
            color={m.sender === "Uzman" ? "primary" : "text.secondary"}
            sx={{ mb: 1 }}
          >
            <b>{m.sender}:</b> {m.text}
          </Typography>
        ))}
      </Paper>
      <TextField
        fullWidth
        label="Sorunuzu yazın..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={sendMessage}>
        Gönder
      </Button>
      {suggestedDeadline && (
        <Button
          variant="outlined"
          color="success"
          sx={{ mt: 2, ml: 2 }}
          onClick={addSuggestedDeadline}
        >
          {suggestedDeadline.title} - {suggestedDeadline.date} Takvime Ekle
        </Button>
      )}
    </Box>
  );
}
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

export default function Dashboard({ user }) {
  const [deadlines, setDeadlines] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const fetchDeadlines = async () => {
    const res = await axios.get("/api/deadlines");
    setDeadlines(res.data);
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const addDeadline = async () => {
    if (!title || !date) return;
    const res = await axios.post("/api/deadlines", { title, date });
    setDeadlines(res.data);
    setTitle(""); setDate("");
  };

  const removeDeadline = async (id) => {
    const res = await axios.delete(`/api/deadlines/${id}`);
    setDeadlines(res.data);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Yaklaşan Yasal Son Tarihler</Typography>
      <List>
        {deadlines.map(d => (
          <ListItem key={d.id} secondaryAction={
            <Button color="error" onClick={() => removeDeadline(d.id)}>Sil</Button>
          }>
            <ListItemText primary={d.title} secondary={d.date} />
          </ListItem>
        ))}
      </List>
      <Box mt={3}>
        <Typography variant="subtitle1">Yeni Son Tarih Ekle</Typography>
        <TextField label="Başlık" value={title} onChange={e => setTitle(e.target.value)} sx={{ mr: 2 }} />
        <TextField type="date" value={date} onChange={e => setDate(e.target.value)} sx={{ mr: 2 }} />
        <Button variant="contained" onClick={addDeadline}>Ekle</Button>
      </Box>
    </Box>
  );
}
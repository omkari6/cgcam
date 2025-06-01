import React, { useState } from "react";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

export default function RegulatoryKnowledge() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await axios.get(`/api/regulations?q=${encodeURIComponent(query)}`);
    setResults(res.data);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Mevzuat Bilgi Bankası</Typography>
      <TextField
        fullWidth
        label="Mevzuatta ara..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={search}>Ara</Button>
      <List>
        {results.map((r, i) => (
          <ListItem key={i}>
            <ListItemText primary={r.title} secondary={r.content} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
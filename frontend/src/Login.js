import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/login", { email, password });
      setUser(res.data.user);
    } catch {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" mb={2}>Yatırımcı İlişkileri Giriş</Typography>
      <TextField
        label="E-posta"
        fullWidth
        value={email}
        onChange={e => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Şifre"
        type="password"
        fullWidth
        value={password}
        onChange={e => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleLogin}>Giriş Yap</Button>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
    </Box>
  );
}
import React, { useState } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import Dashboard from "./Dashboard";
import ExpertChat from "./ExpertChat";
import RegulatoryKnowledge from "./RegulatoryKnowledge";
import Login from "./Login";

function App() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);

  if (!user) return <Login setUser={setUser} />;

  return (
    <Box>
      <AppBar position="static">
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Panel" />
          <Tab label="Uzman Chatbot" />
          <Tab label="Mevzuat Bilgi Bankası" />
        </Tabs>
      </AppBar>
      {tab === 0 && <Dashboard user={user} />}
      {tab === 1 && <ExpertChat user={user} />}
      {tab === 2 && <RegulatoryKnowledge user={user} />}
    </Box>
  );
}

export default App;
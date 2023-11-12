import React from 'react';
import { Route, Routes } from "react-router-dom"
import AllQuestionsPage from "./pages/AllQuestionsPage"
import NewQuestionPage from "./pages/NewQuestionPage"
import "typeface-noto-sans";

function App() {
  return (
    <div className="bg-background text-foreground border-border">
      <Routes>
        <Route path="/" element={AllQuestionsPage()} />
        <Route path="/new" element={NewQuestionPage()} />
      </Routes>
    </div>
  );
}

export default App;

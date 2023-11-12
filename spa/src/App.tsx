import React from 'react';
import { Route, Routes } from "react-router-dom"
import QuestionPage from "./pages/QuestionPage"
import NewQuestionPage from "./pages/NewQuestionPage"
import "typeface-noto-sans";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="dark bg-background text-foreground border-border">
      <Routes>
        <Route path="/" element={QuestionPage()} />
        <Route path="/new" element={NewQuestionPage()} />
      </Routes>
    </div>
  );
}

export default App;

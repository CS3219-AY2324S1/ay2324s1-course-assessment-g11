import React from 'react';
import { Route, Routes } from "react-router-dom"
import AllQuestionsPage from "./pages/AllQuestionsPage"
import NewQuestionPage from "./pages/NewQuestionPage"
import EditQuestionPage from './pages/EditQuestionPage';
import ViewQuestionPage from './pages/ViewQuestionPage';

function App() {
  return (
    <div className="dark bg-background text-foreground border-border">
      <Routes>
        <Route path="/" element={<AllQuestionsPage />} />
        <Route path="/new" element={<NewQuestionPage />} />
        <Route path="/edit/:questionId" element={<EditQuestionPage />} />
        <Route path="/view/:questionId" element={<ViewQuestionPage />} />
      </Routes>
    </div>
  );
}

export default App;

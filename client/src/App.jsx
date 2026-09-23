import { Routes, Route } from "react-router-dom";
import WordList from "./pages/WordList";
import AddWord from "./pages/AddWord";
import ImportWord from "./pages/ImportWord";
import ReviewSetup from "./pages/ReviewSetup";
import ReviewSession from "./pages/ReviewSession";
import ReviewResult from "./pages/ReviewResult";
import GrammarList from "./pages/GrammarList";
import GrammarDetail from "./pages/GrammarDetail";
import GrammarReviewSetup from "./pages/GrammarReviewSetup";
import GrammarReviewSession from "./pages/GrammarReviewSession";
import GrammarReviewResult from "./pages/GrammarReviewResult";
import AddGrammar from "./pages/AddGrammar";
import EditGrammar from "./components/EditGrammar";
import ImportGrammar from "./pages/ImportGrammar";
import PronunciationPage from "./pages/PronunciationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WordList />} />
      <Route path="/add" element={<AddWord />} />
      <Route path="/import" element={<ImportWord />} />
      <Route path="/review" element={<ReviewSetup />} />
      <Route path="/review/session" element={<ReviewSession />} />
      <Route path="/review/result" element={<ReviewResult />} />
      <Route path="/grammar" element={<GrammarList />} />
      <Route path="/grammar/add" element={<AddGrammar />} />
      <Route path="/grammar/import" element={<ImportGrammar />} />
      <Route path="/grammar/:id/edit" element={<EditGrammar />} />
      <Route path="/grammar/:id" element={<GrammarDetail />} />
      <Route path="/grammar/review" element={<GrammarReviewSetup />} />
      <Route
        path="/grammar/review/session"
        element={<GrammarReviewSession />}
      />
      <Route path="/grammar/review/result" element={<GrammarReviewResult />} />
      <Route path="/pronunciation" element={<PronunciationPage />} />
    </Routes>
  );
}

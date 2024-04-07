import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Inform from "./pages/inform/Inform";
import ClassifyNews from "./pages/classify_news/ClassifyNews";

function App() {
  return (
    <>
      {/* <nav>Navbar</nav> */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inform-us" element={<Inform />} />
          <Route path="/classify-news" element={<ClassifyNews />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

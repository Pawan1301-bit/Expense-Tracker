import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Transation from "./components/Transation";
import Analysize from "./components/Analysize";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Transation />} />

        {/* New page route */}
        <Route path="/analysize" element={<Analysize />} />
      </Routes>
    </Router>
  );
}

export default App;

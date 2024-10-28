import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OffsetPagination from "./Pages/OffsetPagination";
import HomePage from "./Pages/Home";
import InfiniteScrollPage from "./Pages/InfiniteScroll";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/pagination" element={<OffsetPagination />} />
          <Route path="/infinite-scroll" element={<InfiniteScrollPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

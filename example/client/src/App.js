import StopWatch from "./components/StopWatch";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./components/Room";

import "./App.css";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Room />} />
                    <Route path="/room/:roomName" element={<StopWatch />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

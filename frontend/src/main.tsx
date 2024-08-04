import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Realtime from './realtime';
import "./tailwind.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Router>
        <Routes>
            <Route path="/" element={<Realtime />} />
        </Routes>
    </Router>
);
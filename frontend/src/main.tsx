import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Realtime from './realtime';
import "./tailwind.css";
import Calculator from './calculator';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Router>
        <Routes>
            <Route path="/" element={<Realtime />} />
            <Route path="/calculator" element={<Calculator />} />
        </Routes>
    </Router>
);
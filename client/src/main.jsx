import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';

import AdminDashboard from './pages/AdminDashboard.jsx';
import CreateVariant from './pages/CreateVariant.jsx';
import VariantDetail from './pages/VariantDetail.jsx';
import TakeQuiz from './pages/TakeQuiz.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/new" element={<CreateVariant />} />
        <Route path="/variant/:id" element={<VariantDetail />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

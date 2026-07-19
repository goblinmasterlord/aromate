import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SuspenseLoading from './components/SuspenseLoading';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Results = React.lazy(() => import('./pages/Results'));
const Admin = React.lazy(() => import('./pages/Admin'));

// Note: routes are deliberately NOT wrapped in AnimatePresence. Combining
// mode="wait" exit animations with lazy-loaded routes suspended the incoming
// page while the outgoing one was stuck mid-exit, intermittently leaving a
// blank screen. Pages animate themselves on mount instead.
const App = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<SuspenseLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;

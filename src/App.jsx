import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import SuspenseLoading from './components/SuspenseLoading';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Results = React.lazy(() => import('./pages/Results'));
const Admin = React.lazy(() => import('./pages/Admin'));

// Wrap routes with AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<SuspenseLoading />}>
          <AnimatedRoutes />
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { useLenis } from './hooks/useLenis';

function AppContent() {
  useLenis();
  const { pathname } = useLocation();
  const isDemoPage = pathname === '/demo';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>
      {!isDemoPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

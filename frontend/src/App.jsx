import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ChatWidget from './components/ChatWidget';

function App() {


  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ChatWidget />
    </>
  )
}

export default App

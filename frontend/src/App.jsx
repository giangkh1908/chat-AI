import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ChatWidget from './components/ChatWidget';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Registerpage';
import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {


  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/verify/:token" element={<VerifyEmailPage />} /> 
        </Routes>
      </BrowserRouter>
      <ChatWidget />
    </>
  )
}

export default App

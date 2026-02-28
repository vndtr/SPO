import { Routes, Route  } from 'react-router-dom'
import MainView from './pages/MainView'
import LibraryView from './pages/LibraryView'
import ReaderView from './pages/ReaderView'
import SessionsView from './pages/SessionsView'
import ProfileView from './pages/ProfileView'
import SessionReaderView from './pages/SessionReaderView.jsx';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/library" element={<LibraryView />} /> 
        <Route path="/reader" element={<ReaderView />} /> 
        <Route path="/sessions" element={<SessionsView />} /> 
        <Route path="/profile" element={<ProfileView />} /> 
        <Route path="/session-reader" element={<SessionReaderView />} />
      </Routes>
    </>
  )
}

export default App

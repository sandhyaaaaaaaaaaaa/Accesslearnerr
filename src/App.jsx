import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout, { PublicLayout } from './components/layout/Layout';
import GlobalVoiceControl from './features/voice-navigation/components/GlobalVoiceControl';
import GlobalGestureControl from './features/gesture-accessibility/components/GlobalGestureControl';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Upload from './pages/Upload';
import WebcamCapture from './pages/WebcamCapture';
import Processing from './pages/Processing';
import OutputViewer from './pages/OutputViewer';
import Chatbot from './pages/Chatbot';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';
import GestureControlPage from './pages/GestureControlPage';
import Doubts from './pages/Doubts';
import Flashcards from './pages/Flashcards';
import SignLanguageMode from './pages/SignLanguageMode';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <Layout showSidebar />
                </ProtectedRoute>
              }
            >
              {/* Student routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>
              } />
              <Route path="/student/upload" element={
                <ProtectedRoute allowedRoles={['student']}><Upload /></ProtectedRoute>
              } />
              <Route path="/student/webcam" element={
                <ProtectedRoute allowedRoles={['student']}><WebcamCapture /></ProtectedRoute>
              } />
              <Route path="/student/processing" element={
                <ProtectedRoute allowedRoles={['student']}><Processing /></ProtectedRoute>
              } />
              <Route path="/student/output" element={
                <ProtectedRoute allowedRoles={['student']}><OutputViewer /></ProtectedRoute>
              } />
              <Route path="/student/chat" element={
                <ProtectedRoute allowedRoles={['student']}><Chatbot /></ProtectedRoute>
              } />
              <Route path="/student/quiz" element={
                <ProtectedRoute allowedRoles={['student']}><Quiz /></ProtectedRoute>
              } />
              <Route path="/student/settings" element={
                <ProtectedRoute allowedRoles={['student']}><Settings /></ProtectedRoute>
              } />
              <Route path="/student/gesture-control" element={
                <ProtectedRoute allowedRoles={['student']}><GestureControlPage /></ProtectedRoute>
              } />
              <Route path="/student/doubts" element={
                <ProtectedRoute allowedRoles={['student']}><Doubts /></ProtectedRoute>
              } />
              <Route path="/student/flashcards" element={
                <ProtectedRoute allowedRoles={['student']}><Flashcards /></ProtectedRoute>
              } />
              <Route path="/student/sign-language" element={
                <ProtectedRoute allowedRoles={['student']}><SignLanguageMode /></ProtectedRoute>
              } />

              {/* Teacher routes */}
              <Route path="/teacher/dashboard" element={
                <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
              } />
              <Route path="/teacher/upload" element={
                <ProtectedRoute allowedRoles={['teacher']}><Upload /></ProtectedRoute>
              } />
              <Route path="/teacher/students" element={
                <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
              } />
              <Route path="/teacher/analytics" element={
                <ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>
              } />
              <Route path="/teacher/settings" element={
                <ProtectedRoute allowedRoles={['teacher']}><Settings /></ProtectedRoute>
              } />
              <Route path="/teacher/gesture-control" element={
                <ProtectedRoute allowedRoles={['teacher']}><GestureControlPage /></ProtectedRoute>
              } />
              <Route path="/teacher/doubts" element={
                <ProtectedRoute allowedRoles={['teacher']}><Doubts /></ProtectedRoute>
              } />
              <Route path="/teacher/quiz" element={
                <ProtectedRoute allowedRoles={['teacher']}><Quiz /></ProtectedRoute>
              } />
              <Route path="/teacher/flashcards" element={
                <ProtectedRoute allowedRoles={['teacher']}><Flashcards /></ProtectedRoute>
              } />
              <Route path="/teacher/sign-language" element={
                <ProtectedRoute allowedRoles={['teacher']}><SignLanguageMode /></ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <GlobalGestureControl />
          <GlobalVoiceControl />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

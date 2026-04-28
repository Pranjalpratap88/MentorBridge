import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Error404Page from './pages/Error404Page';
import AdminPanel from './pages/AdminPanel';
import ConnectionRequests from './pages/ConnectionRequests';
import ExploreFilters from './pages/ExploreFilters';
import ForgotPassword from './pages/ForgotPassword';
import KnowledgeBase from './pages/KnowledgeBase';
import Leaderboard from './pages/Leaderboard';
import MentorProfilePublic from './pages/MentorProfilePublic';
import Messages from './pages/Messages';
import Networking from './pages/Networking';
import Notifications from './pages/Notifications';
import ProfilePage from './pages/ProfilePage';
import QueryDetail from './pages/QueryDetail';
import QueryFeed from './pages/QueryFeed';
import QueryHistory from './pages/QueryHistory';
import ResumeManagement from './pages/ResumeManagement';
import ResumeReview from './pages/ResumeReview';
import RewardsPoints from './pages/RewardsPoints';
import SearchResults from './pages/SearchResults';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import OAuth2Callback from './pages/OAuth2Callback';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import PublicRoute from './components/common/PublicRoute';
import { HistoryProvider } from './context/HistoryContext';
import './index.css';

function App() {
  return (
    <Router>
      <HistoryProvider>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><ConnectionRequests /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExploreFilters /></ProtectedRoute>} />
          <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBase /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/mentor/:id" element={<ProtectedRoute><MentorProfilePublic /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/networking" element={<ProtectedRoute><Networking /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/query/:id" element={<ProtectedRoute><QueryDetail /></ProtectedRoute>} />
          <Route path="/queries" element={<ProtectedRoute><QueryFeed /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><QueryHistory /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeManagement /></ProtectedRoute>} />
          <Route path="/resume-review/:id" element={<ProtectedRoute><ResumeReview /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><RewardsPoints /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
      </HistoryProvider>
    </Router>
  );
}

export default App;

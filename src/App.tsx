import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyResumes from './pages/MyResumes';
import Templates from './pages/Templates';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import Profile from './pages/Profile';
import JDUploads from './pages/JDUploads';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="templates" element={<Templates />} />
          <Route path="jd-uploads" element={<JDUploads />} />
          <Route path="resumes" element={<MyResumes />} />
          <Route path="editor/:id?" element={<Editor />} />
          <Route path="preview/:id" element={<Preview />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Login } from "./components/Login"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { MovieManagement } from "./pages/MovieManagement"
import { EpisodeManagement } from "./pages/EpisodeManagement"
import { UserManagement } from "./pages/UserManagement"
import { AdminCommentManagement } from "./pages/AdminCommentManagement"
import { MovieDetailPage } from "./pages/MovieDetailPage"
import Header from "./components/Header"
import Home from "./pages/Home"
import { Test } from "./components/Test"
import Detail from "./pages/Detail"
import Watch from "./pages/Watch"
import Schedule from "./pages/Schedule"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/watch/:movieId/:epId" element={<Watch />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="movies" replace />} />
          <Route path="movies" element={<MovieManagement />} />
          <Route path="episodes" element={<EpisodeManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="comments" element={<AdminCommentManagement />} />
          <Route path="admin" element={<Navigate to="/movies" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

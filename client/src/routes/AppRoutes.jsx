import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import LoginPage from "../pages/LoginPage"
import StudentRegisterPage from "../pages/StudentRegisterPage"
import InstructorRegisterPage from "../pages/InstructorRegisterPage"
import StudentDashboardPage from "../pages/StudentDashboardPage"
import InstructorDashboardPage from "../pages/InstructorDashboardPage"
import StudentCoursePage from "../pages/StudentCoursePage"
import InstructorCoursePage from "../pages/InstructorCoursePage"
import ModulePage from "../pages/ModulePage"
import StudentAssignmentPage from "../pages/StudentAssignmentPage"
import InstructorAssignmentsPage from "../pages/InstructorAssignmentsPage"
import InstructorAssignmentPage from "../pages/InstructorAssignmentPage"
import StudentGradesPage from "../pages/StudentGradesPage"
import FileViewerPage from "../pages/FileViewerPage"
import CalendarPage from "../pages/CalendarPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/student" element={<StudentRegisterPage />} />
      <Route path="/register/instructor" element={<InstructorRegisterPage />} />
      <Route path="/student/dashboard" element={<StudentDashboardPage />} />
      <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
      <Route path="/student/course/:courseId" element={<StudentCoursePage />} />
      <Route path="/student/course/:courseId/grades" element={<StudentGradesPage />} />
      <Route path="/instructor/course/:courseId" element={<InstructorCoursePage />} />
      <Route path="/instructor/course/:courseId/assignments" element={<InstructorAssignmentsPage />} />
      <Route path="/module/:moduleId" element={<ModulePage />} />
      <Route path="/assignment/:assignmentId" element={<StudentAssignmentPage />} />
      <Route path="/instructor/assignment/:assignmentId" element={<InstructorAssignmentPage />} />
      <Route path="/file-viewer" element={<FileViewerPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  )
}

export default AppRoutes
import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import { ScrollToTop } from "./components/common/ScrollToTop.tsx";
import Home from "./pages/Dashboard/Home.tsx";
import SignUp from "./pages/AuthPages/SignUp.tsx";
import SignIn from "./pages/AuthPages/SignIn.tsx";
import DepartmentList from "./pages/EmployeePage/department/list.jsx";
import DepartmentAdd from "./pages/EmployeePage/department/add.jsx";
import DepartmentEdit from "./pages/EmployeePage/department/edit.jsx";
import EmployeeList from "./pages/EmployeePage/employee/list.jsx";
import EmployeeAdd from "./pages/EmployeePage/employee/add.jsx";
import EmployeeEdit from "./pages/EmployeePage/employee/edit.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import Course from "./pages/Courses/courses/index.jsx";
import CourseAdd from "./pages/Courses/courses/add.jsx";
import CourseEdit from "./pages/Courses/courses/edit.jsx";
import BranchList from "./pages/Branch/index.jsx";
import BranchAdd from "./pages/Branch/add.jsx";
import Programs from "./pages/Courses/programs/index.jsx";
import ProgramAdd from "./pages/Courses/programs/add.jsx";
import ProgramEdit from "./pages/Courses/programs/edit.jsx";
import BranchEdit from "./pages/Branch/edit.jsx";
import SubjectList from "./pages/Courses/subject/index.jsx";
import SubjectAdd from "./pages/Courses/subject/add.jsx";
import SubjectEdit from "./pages/Courses/subject/edit.jsx";
import SyllabusList from "./pages/Study-Materials/syllabus/index.jsx";
import SyllabusAdd from "./pages/Study-Materials/syllabus/add.jsx";
import SyllabusEdit from "./pages/Study-Materials/syllabus/edit.jsx";
export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <ToastContainer className="!z-[10000]" position="bottom-right" />
        <Routes>
          {/* Dashboard Layout */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            {/* branch routes  */}
            <Route index path="/branch" element={<BranchList />} />
            <Route index path="/branch/add" element={<BranchAdd />} />
            <Route index path="/branch/edit/:id" element={<BranchEdit />} />

            {/* course routes  */}
            <Route index path="/courses" element={<Course />} />
            <Route index path="/courses/add" element={<CourseAdd />} />
            <Route index path="/courses/edit/:id" element={<CourseEdit />} />

            {/* subject routes  */}
            <Route index path="/subject" element={<SubjectList />} />
            <Route index path="/subject/add" element={<SubjectAdd />} />
            <Route index path="/subject/edit/:id" element={<SubjectEdit />} />

            {/* syllabus routes  */}
            <Route index path="/syllabus" element={<SyllabusList />} />
            <Route index path="/syllabus/add" element={<SyllabusAdd />} />
            <Route index path="/syllabus/edit/:id" element={<SyllabusEdit />} />

            <Route index path="/employees" element={<EmployeeList />} />
            <Route
              index
              path="/employees/department"
              element={<DepartmentList />}
            />
            <Route
              index
              path="/employees/department/add"
              element={<DepartmentAdd />}
            />
            <Route
              index
              path="/employees/department/edit/:id"
              element={<DepartmentEdit />}
            />
            <Route index path="/employees/add" element={<EmployeeAdd />} />
            <Route
              index
              path="/employees/edit/:id"
              element={<EmployeeEdit />}
            />

            {/* program routes  */}
            <Route index path="/programs" element={<Programs />} />
            <Route index path="/programs/add" element={<ProgramAdd />} />
            <Route index path="/programs/edit/:id" element={<ProgramEdit />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

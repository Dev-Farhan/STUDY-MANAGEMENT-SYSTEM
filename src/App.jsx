import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import { ScrollToTop } from "./components/common/ScrollToTop.tsx";
import Home from "./pages/Dashboard/Home.tsx";
import DepartmentList from "./pages/EmployeePage/department/list.jsx";
import DepartmentAdd from "./pages/EmployeePage/department/add.jsx";
import DepartmentEdit from "./pages/EmployeePage/department/edit.jsx";
import EmployeeList from "./pages/EmployeePage/employee/list.jsx";
import EmployeeAdd from "./pages/EmployeePage/employee/add.jsx";
import EmployeeEdit from "./pages/EmployeePage/employee/edit.jsx";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route index path="/employees" element={<EmployeeList />} />
            <Route
              index
              path="/employees/department"
              element={<DepartmentList />}
            />
            <Route index path="/department/add" element={<DepartmentAdd />} />
            <Route
              index
              path="/department/edit/:id  "
              element={<DepartmentEdit />}
            />
            <Route index path="/employees/add" element={<EmployeeAdd />} />
            <Route
              index
              path="/employees/edit/:id"
              element={<EmployeeEdit />}
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

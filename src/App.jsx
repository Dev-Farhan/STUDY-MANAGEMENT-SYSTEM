import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn.js";
import SignUp from "./pages/AuthPages/SignUp.js";
import NotFound from "./pages/OtherPage/NotFound.js";
import UserProfiles from "./pages/UserProfiles.js";
import Videos from "./pages/UiElements/Videos.js";
import Images from "./pages/UiElements/Images.js";
import Alerts from "./pages/UiElements/Alerts.js";
import Badges from "./pages/UiElements/Badges.js";
import Avatars from "./pages/UiElements/Avatars.js";
import Buttons from "./pages/UiElements/Buttons.js";
import LineChart from "./pages/Charts/LineChart.js";
import BarChart from "./pages/Charts/BarChart.js";
import Calendar from "./pages/Calendar.js";
import BasicTables from "./pages/Tables/BasicTables.js";
import FormElements from "./pages/Forms/FormElements.js";
import Blank from "./pages/Blank.js";
import AppLayout from "./layout/AppLayout.js";
import { ScrollToTop } from "./components/common/ScrollToTop.js";
import Home from "./pages/Dashboard/Home.js";
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

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

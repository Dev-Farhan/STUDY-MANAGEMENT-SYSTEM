import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../Tables/CustomTable";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import Switch from "../../../components/form/switch/Switch.js";
import { toggleEmployeeStatus } from "../../../utils/toggleUtils.js";
import Supabase from "../../../config/supabaseClient.ts";
import { Modal } from "../../../components/ui/modal/index.tsx";
import { IoWarningOutline } from "react-icons/io5";

const EmployeeList = () => {
  let navigate = useNavigate();
  const handleToggleStatus = (employeeId, currentStatus) => {
    toggleEmployeeStatus(employeeId, currentStatus, setEmployeesData, navigate);
  };

  const columns = [
    { key: "employee_name", label: "Employee Name" },
    { key: "department", label: "Department" },
    { key: "mobile_number", label: "Mobile Number" },
    {
      key: "isActive",
      label: "Active",
      render: (value, row) => (
        <Switch
          label=""
          checked={row.isActive || false}
          onChange={() => {
            handleToggleStatus(row.id, row.isActive);
          }}
        />
      ),
    },
  ];
  const [employeesData, setEmployeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: null, title: "" });

  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  let paginatedData = employeesData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(employeesData.length / rowsPerPage);

  // Debounced fetch function
  const fetchCourses = async (query) => {
    setIsLoading(true);
    try {
      let supabaseQuery = Supabase.from("employees").select("*");

      if (query.trim() !== "") {
        const q = query.trim();
        // search both first and last name
        supabaseQuery = supabaseQuery.or(
          `employee_first_name.ilike.%${q}%,employee_last_name.ilike.%${q}%`
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        toast.error("Search error: " + error.message);
        console.error("Supabase search error:", error);
        return;
      }

      // combine first + last name for display
      const mapped = (data || []).map((r) => ({
        ...r,
        employee_name: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
      }));
      setEmployeesData(mapped);
      setIsLoading(false);
    } catch (err) {
      toast.error("Unexpected error during search");
      console.error("Unexpected search error:", err);
      setIsLoading(false);
    }
  };

  // Memoized debounced function (created once)
  const debouncedFetch = useCallback(debounce(fetchCourses, 1000), []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
    debouncedFetch(value); // calls the debounced fetch function
  };

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      setIsLoading(true);
      let { data: employees, error } = await Supabase.from("employees").select(
        "*"
      );
      if (error) {
        toast.error(error?.message);
        console.error("Employees List Error:", error.message);
        return;
      }
      const mapped = (employees || []).map((r) => ({
        ...r,
        employee_name: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
        department:
          r.department?.replace(/^./, (char) => char.toUpperCase()) || "N/A",
      }));
      setEmployeesData(mapped);
      setIsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const { error } = await Supabase.from("employees").delete().eq("id", id);

      if (error) {
        toast.error(error.message);
        console.error("Employees Delete Error:", error.message);
        return;
      }

      await getEmployees(); // wait for table refresh before closing modal

      toast.success("Employee record deleted successfully");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Employee List" />
      <div className="space-y-6">
        <ComponentCard title="Employee List">
          <CustomTable
            columns={columns}
            data={paginatedData}
            loading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={(employee) => navigate(`/employees/edit/${employee.id}`)}
            onDelete={(employee) => {
              setItemToDelete(employee);
              setIsDeleteModalOpen(true);
            }}
            showSearch={true}
            searchValue={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search employees..."
            showAddButton={true}
            addButtonText="Add Employee"
            onAddClick={() => navigate("/employees/add")}
          />
        </ComponentCard>
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        className="max-w-md mx-auto p-6"
        showCloseButton={false}
      >
        <div className="text-center space-y-4">
          {/* Warning Image */}
          <div className="flex justify-center">
            <IoWarningOutline color="yellow" className="h-16 w-16" />
          </div>

          {/* Warning Text */}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Are you sure you want to delete this employee record?
          </h2>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => {
                if (itemToDelete) {
                  handleDelete(itemToDelete.id);
                }
                setIsDeleteModalOpen(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmployeeList;

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../Tables/CustomTable";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Switch from "../../../components/form/switch/Switch";
import { toast } from "react-toastify";
import Supabase from "../../../config/supabaseClient.ts";
import { toggleDepartmentStatus } from "../../../utils/toggleUtils.js";
import { Modal } from "../../../components/ui/modal/index.tsx";
import { IoWarningOutline } from "react-icons/io5";

const DepartmentList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentsData, setDepartmentsData] = useState([]);
  const rowsPerPage = 10;

  const getDepartments = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const {
        data: { session },
      } = await Supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to view departments");
        navigate("/sign-in");
        return;
      }

      const { data: departments, error } = await Supabase.from("department")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error?.message);
        console.error("Department List Error:", error.message);
        return;
      }

      setDepartmentsData(departments || []);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDepartment = async (departmentId) => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const {
        data: { session },
      } = await Supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to delete departments");
        navigate("/sign-in");
        return;
      }

      const { error } = await Supabase.from("department")
        .delete()
        .eq("id", departmentId);

      if (error) {
        toast.error(error?.message);
        console.error("Department Delete Error:", error.message);
        return;
      }

      toast.success("Department deleted successfully!");
      // Refresh the list
      await getDepartments();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Delete Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (departmentId, currentStatus) => {
    toggleDepartmentStatus(
      departmentId,
      currentStatus,
      setDepartmentsData,
      navigate
    );
  };

  useEffect(() => {
    getDepartments();
  }, []);

  // Filter data based on search - fix the field name
  const filteredData = departmentsData.filter((item) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    return (
      item.department_name?.toLowerCase().includes(searchTerm) ||
      item.id?.toString().includes(searchTerm)
    );
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const calculatedTotalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Define the table columns with correct field mapping
  const columns = [
    { key: "department_name", label: "Department Name" },
    { key: "id", label: "ID" },
    {
      key: "status",
      label: "Status",
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

  return (
    <>
      <PageMeta
        title="Department List | Study Management System"
        description="Manage and view all departments in the study management system"
      />
      <PageBreadcrumb pageTitle="Department List" />
      <div className="space-y-6">
        <ComponentCard title="Department List">
          <CustomTable
            columns={columns}
            data={paginatedData}
            loading={isLoading}
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={setCurrentPage}
            onEdit={(department) =>
              navigate(`/employees/department/edit/${department.id}`)
            }
            onDelete={(department) => {
              setItemToDelete(department);
              setIsDeleteModalOpen(true);
            }}
            showSearch={true}
            searchValue={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search departments by name or ID..."
            showAddButton={true}
            addButtonText="Add Department"
            onAddClick={() => navigate("/employees/department/add")}
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
            Are you sure you want to delete this department record?
          </h2>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => {
                if (itemToDelete) {
                  deleteDepartment(itemToDelete.id);
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
              }}
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

export default DepartmentList;

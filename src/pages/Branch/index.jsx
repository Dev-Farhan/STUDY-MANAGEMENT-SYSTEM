import { useEffect, useState, useCallback } from "react";
import ComponentCard from "@components/common/ComponentCard";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import Supabase from "@config/supabaseClient.ts";
import { toast } from "react-toastify";
import Switch from "@components/form/switch/Switch.js";
import { useNavigate } from "react-router";
import { Modal } from "@components/ui/modal/index.js";
import { IoWarningOutline } from "react-icons/io5";
import debounce from "lodash/debounce";
import CustomTable from "../Tables/CustomTable.jsx";
import { toggleBranchStatus } from "../../utils/toggleUtils.js";

const BranchList = () => {
  let navigate = useNavigate();

  const handleToggleStatus = (branchId, currentStatus) => {
    toggleBranchStatus(branchId, currentStatus, setCoursesData, navigate);
  };

  const columns = [
    {
      key: "center_name",
      label: "Center Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {value}
          {row.is_primary && (
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
              Primary
            </span>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
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
  const [coursesData, setCoursesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  let paginatedData = coursesData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(coursesData.length / rowsPerPage);

  // Debounced fetch function
  const fetchCourses = async (query) => {
    setIsLoading(true);
    try {
      let supabaseQuery = Supabase.from("branch").select("*");

      if (query.trim() !== "") {
        supabaseQuery = supabaseQuery.ilike("center_name", `%${query.trim()}%`);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        toast.error("Search error: " + error.message);
        console.error("Supabase search error:", error);
        return;
      }

      setCoursesData(data);
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

  // const handleSearchChange = (e) => {
  //   // console.log('search',e)
  //   const value = e.target.value;
  //   setSearch(value);
  //   paginatedData = coursesData.filter(
  //     (course) => course.course_name.toLowerCase().includes(value.toLowerCase())
  //     // console.log(course.course_name.toLowerCase().includes(value.toLowerCase().trim()),'course')
  //   );
  //   setCurrentPage(1);
  // };

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    try {
      setIsLoading(true);
      let { data: branch, error } = await Supabase.from("branch").select("*");
      if (error) {
        toast.error(error?.message);
        console.error("Branch List Error:", error.message);
        return;
      }
      setCoursesData(branch);
      setIsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      // First check if this is the primary branch
      const { data: branchData, error: fetchError } = await Supabase.from(
        "branch"
      )
        .select("is_primary")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast.error("Error fetching branch details");
        console.error("Branch Fetch Error:", fetchError.message);
        setIsDeleting(false);
        return;
      }

      // If this is the primary branch, prevent deletion
      if (branchData?.is_primary) {
        toast.error("Primary branch cannot be deleted");
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        return;
      }

      // Proceed with deletion if not primary
      const { error: deleteError } = await Supabase.from("branch")
        .delete()
        .eq("id", id);

      if (deleteError) {
        toast.error(deleteError.message);
        console.error("Branch Delete Error:", deleteError.message);
        return;
      }

      await getBranches(); // wait for table refresh before closing modal
      toast.success("Branch record deleted successfully");
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
      <PageBreadcrumb pageTitle="Branch List" />
      <div className="space-y-6">
        <ComponentCard title="Branch List">
          <CustomTable
            columns={columns}
            data={paginatedData}
            loading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={(branch) => navigate(`/branch/edit/${branch.id}`)}
            onDelete={(branch) => {
              setItemToDelete(branch);
              setIsDeleteModalOpen(true);
            }}
            showSearch={true}
            searchValue={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search branches..."
            showAddButton={true}
            addButtonText="Add Branch"
            onAddClick={() => navigate("/branch/add")}
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
            Are you sure you want to delete this branch record?
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

export default BranchList;

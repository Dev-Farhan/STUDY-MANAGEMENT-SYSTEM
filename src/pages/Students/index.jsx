import { useEffect, useState, useCallback } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import Supabase from "../../config/supabaseClient.ts";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index.js";
import Switch from "../../components/form/switch/Switch.js";
import { useNavigate } from "react-router";
import { Modal } from "../../components/ui/modal/index.js";
import { IoWarningOutline } from "react-icons/io5";
import debounce from "lodash/debounce";
import CustomTable from "../Tables/CustomTable.jsx";
import { toggleCourseStatus } from "../../utils/toggleUtils.js";

const Students = () => {
  let navigate = useNavigate();

  //   const handleToggleStatus = (courseId, currentStatus) => {
  //     toggleCourseStatus(courseId, currentStatus, setStudentsData, navigate);
  //   };

  const columns = [
    { key: "student_name", label: "Student Name" },
    { key: "course_category", label: "Course Category" },
    { key: "course_name", label: "Courese Name" },
    { key: "mobile_number", label: "Contact" },

    {
      key: "isActive",
      label: "Active",
      render: (value, row) => (
        <Switch
          label=""
          checked={row.is_Active || false}
          onChange={() => {
            handleToggleStatus(row.id, row.is_Active);
          }}
        />
      ),
    },
  ];
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rowsPerPage = 10;

  const formattedObject = studentsData.map((student) => ({
    ...student,
    course_category: student?.programs?.program_name || "N/A",
    course_name: student?.courses?.course_name || "N/A",
  }));

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  let paginatedData = formattedObject.slice(startIndex, endIndex);
  const totalPages = Math.ceil(formattedObject.length / rowsPerPage);

  // Debounced fetch function
  const fetchCourses = async (query) => {
    setIsLoading(true);
    try {
      let supabaseQuery = Supabase.from("student").select("*");

      if (query.trim() !== "") {
        supabaseQuery = supabaseQuery.ilike(
          "student_name",
          `%${query.trim()}%`
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        toast.error("Search error: " + error.message);
        console.error("Supabase search error:", error);
        return;
      }

      setStudentsData(data);
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
  //   paginatedData = studentsData.filter(
  //     (course) => course.course_name.toLowerCase().includes(value.toLowerCase())
  //     // console.log(course.course_name.toLowerCase().includes(value.toLowerCase().trim()),'course')
  //   );
  //   setCurrentPage(1);
  // };

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      setIsLoading(true);
      let { data: students, error } = await Supabase.from("students").select(
        `*,
        programs(id, program_name),
        courses(id, course_name)`
      );
      if (error) {
        toast.error(error?.message);
        console.error("Students List Error:", error.message);
        return;
      }
      setStudentsData(students);
      setIsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const { error } = await Supabase.from("students").delete().eq("id", id);

      if (error) {
        toast.error(error.message);
        console.error("Student Delete Error:", error.message);
        return;
      }

      await getStudents(); // wait for table refresh before closing modal

      toast.success("Student record deleted successfully");
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
      <PageBreadcrumb pageTitle="Students List" />
      <div className="space-y-6">
        <ComponentCard title="Students List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <CustomTable
                columns={columns}
                data={paginatedData}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onEdit={(student) => navigate(`/students/edit/${student.id}`)}
                onDelete={(student) => {
                  setItemToDelete(student);
                  setIsDeleteModalOpen(true);
                }}
                showSearch={true}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search studets..."
                showAddButton={true}
                addButtonText="Add student"
                onAddClick={() => navigate("/Students/add")}
                showImage={true}
                imageKey={studentsData?.student_image_url}
                nameKey={studentsData?.student_name}
              />
            </div>
          </div>
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
            Are you sure you want to delete this course record?
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

export default Students;

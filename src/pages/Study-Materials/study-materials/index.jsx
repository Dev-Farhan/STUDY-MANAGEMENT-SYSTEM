import { useEffect, useState, useCallback } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Supabase from "../../../config/supabaseClient.ts";
import { toast } from "react-toastify";
import Switch from "../../../components/form/switch/Switch.js";
import { useNavigate } from "react-router";
import { Modal } from "../../../components/ui/modal/index.js";
import { IoWarningOutline } from "react-icons/io5";
import debounce from "lodash/debounce";
import CustomTable from "../../Tables/CustomTable.jsx";
import { toggleSyllabusStatus } from "../../../utils/toggleUtils.js";

const SyllabusList = () => {
  let navigate = useNavigate();

  const handleToggleStatus = (syllabusId, currentStatus) => {
    toggleSyllabusStatus(syllabusId, currentStatus, setSyllabusData, navigate);
  };

  const columns = [
    { key: "program_name", label: "Program" }, // new column
    { key: "course_name", label: "Course" },
    { key: "subject_name", label: "Subject Name" },
    {
      key: "isActive",
      label: "Active",
      render: (value, row) => (
        <Switch
          label=""
          checked={!!row.isActive}
          onChange={() => {
            handleToggleStatus(row.id, row.isActive);
          }}
        />
      ),
    },
  ];

  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const rowsPerPage = 10;

  const formattedSubjects = syllabusData.map((sub) => ({
    ...sub, // keep existing fields like id, isActive,
    subject_name: sub.subject?.subject_name
      ? sub.subject?.subject_name
      : sub.subject_name || "-", // map subject name
    program_name: sub.programs?.program_name
      ? sub.programs?.program_name
      : sub.program_name || "-", // map program name
    course_name: sub.courses?.course_name
      ? sub.courses?.course_name
      : sub.course_name || "-", // map course name
  }));

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  let paginatedData = formattedSubjects.slice(startIndex, endIndex);
  const totalPages = Math.ceil(formattedSubjects.length / rowsPerPage);

  // Debounced fetch function
  const fetchCourses = async (query) => {
    setIsLoading(true);
    try {
      let supabaseQuery = Supabase.from("syllabus_view").select("*");

      if (query.trim() !== "") {
        supabaseQuery = supabaseQuery.or(
          `subject_name.ilike.%${query}%,program_name.ilike.%${query}%,course_name.ilike.%${query}%`
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        toast.error("Search error: " + error.message);
        console.error("Supabase search error:", error);
        return;
      }

      setSyllabusData(data);
    } catch (err) {
      toast.error("Unexpected error during search");
      console.error("Unexpected search error:", err);
    } finally {
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
  //   paginatedData = syllabusData.filter(
  //     (course) => course.course_name.toLowerCase().includes(value.toLowerCase())
  //     // console.log(course.course_name.toLowerCase().includes(value.toLowerCase().trim()),'course')
  //   );
  //   setCurrentPage(1);
  // };

  useEffect(() => {
    getSyllabus();
  }, []);

  const getSyllabus = async () => {
    try {
      setIsLoading(true);
      let { data: subjects, error } = await Supabase.from("studymaterial")
        .select(`
        *,
        programs(id, program_name),
        courses(id, course_name),
        subject(id, subject_name)
      `);
      if (error) {
        toast.error(error?.message);
        console.error("Study Material List Error:", error.message);
        return;
      }
      setSyllabusData(subjects);
      setIsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const { error } = await Supabase.from("studymaterial")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error(error.message);
        console.error("Study Material Delete Error:", error.message);
        return;
      }

      await getSyllabus(); // wait for table refresh before closing modal

      toast.success("Study Material record deleted successfully");
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
      <PageBreadcrumb pageTitle="Study Material List" />
      <div className="space-y-6">
        <ComponentCard title="Study Material List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <CustomTable
                columns={columns}
                data={paginatedData}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onEdit={(studyMaterial) =>
                  navigate(`/studymaterial/edit/${studyMaterial.id}`)
                }
                onDelete={(studyMaterial) => {
                  setItemToDelete(studyMaterial);
                  setIsDeleteModalOpen(true);
                }}
                showSearch={true}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search study materials..."
                showAddButton={true}
                addButtonText="Add Study Material"
                onAddClick={() => navigate("/studymaterial/add")}
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
            Are you sure you want to delete this syllabus record?
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

export default SyllabusList;

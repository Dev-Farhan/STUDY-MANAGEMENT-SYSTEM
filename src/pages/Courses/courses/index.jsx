import { useEffect, useState,useCallback  } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableOne";
import Supabase from "../../../config/supabaseClient.js";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.js";
import Button from "../../../components/ui/button/Button.js";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import Pagination from "../../../components/tables/BasicTables/Pagination.js";
import Switch from "../../../components/form/switch/Switch.js";
import { useNavigate } from "react-router";
import { Modal } from "../../../components/ui/modal/index.js";
import { IoWarningOutline } from "react-icons/io5";
import debounce from 'lodash/debounce';

const Course = () => {
  let navigate = useNavigate();
  const tableHeaders = [
    "Course Name",
    "Course Code",
    "Course Fee",
    "Duration",
    "Status",
    "Actions",
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
  try {
    let supabaseQuery = Supabase.from("courses").select("*");

    if (query.trim() !== "") {
      supabaseQuery = supabaseQuery.ilike("course_name", `%${query.trim()}%`);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      toast.error("Search error: " + error.message);
      console.error("Supabase search error:", error);
      return;
    }

    setCoursesData(data);
  } catch (err) {
    toast.error("Unexpected error during search");
    console.error("Unexpected search error:", err);
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
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      setIsLoading(true);
      let { data: courses, error } = await Supabase.from("courses").select("*");
      if (error) {
        toast.error(error?.message);
        console.error("Course List Error:", error.message);
        return;
      }
      setCoursesData(courses);
      setIsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

const handleDelete = async (id) => {
  setIsDeleting(true);
  try {
    const { error } = await Supabase.from("courses").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      console.error("Course Delete Error:", error.message);
      return;
    }

    await getCourses(); // wait for table refresh before closing modal

    toast.success("Course record deleted successfully");
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
      <PageBreadcrumb pageTitle="Courses List" />
      <div className="space-y-6">
        <ComponentCard title="Courses List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-white/[0.05]">
                        <input
                          type="text"
                          value={search}
                          onChange={handleSearchChange}
                          placeholder="Search..."
                          className="border border-gray-400 px-3 py-2 rounded-md text-sm w-full max-w-xs dark:bg-[#1e2636] dark:text-white"
                        />

                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/courses/add`)}
                        >
                          Add
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {tableHeaders.map((header, index) => (
                      <TableCell
                        key={index}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading
                    ? // Render 5 skeleton rows
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          {[...Array(6)].map((_, cellIndex) => (
                            <TableCell key={cellIndex} className="px-4 py-4">
                              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse w-full"></div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : paginatedData.map((course) => (
                        <TableRow key={course.id}>
                          {course?.course_name && (
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {course?.course_name}
                            </TableCell>
                          )}
                          {course?.course_code && (
                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              {course?.course_code}
                            </TableCell>
                          )}
                          {course?.fee && (
                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              {course?.fee}
                            </TableCell>
                          )}
                          {course?.duration && (
                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              {course?.duration}
                            </TableCell>
                          )}

                          {course?.isActive && (
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <Switch
                                label=""
                                defaultChecked={course.isActive ? true : false}
                                onChange={() => {}}
                              />
                            </TableCell>
                          )}
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            <span className="flex items-center gap-2">
                              <MdOutlineEdit
                                size={18}
                                className="hover:text-gray-600"
                                onClick={() => {
                                  navigate(`/courses/edit/${course.id}`);
                                }}
                              />
                              <MdOutlineDelete
                                size={18}
                                className="hover:text-red-600"
                                onClick={() => {
                                  setItemToDelete(course); // pass current item
                                  setIsDeleteModalOpen(true);
                                }}
                              />
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>

                <TableFooter className="border-t border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      colSpan={coursesData.length + 1}
                      className="p-4 dark:text-white/90"
                    >
                      <div className="w-full flex justify-center items-center text-gray-500 dark:text-white/70">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
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

export default Course;

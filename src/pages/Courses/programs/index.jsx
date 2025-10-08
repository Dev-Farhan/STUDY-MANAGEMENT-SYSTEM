import { useEffect, useState, useCallback } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableOne";
import Supabase from "../../../config/supabaseClient.ts";
import { toast } from "react-toastify";
import Switch from "../../../components/form/switch/Switch.js";
import { useNavigate } from "react-router";
import { Modal } from "../../../components/ui/modal/index.js";
import { IoWarningOutline } from "react-icons/io5";
import debounce from "lodash/debounce";
import CustomTable from "../../Tables/CustomTable.jsx";
import { toggleProgramStatus } from "../../../utils/toggleUtils.js";
import ImageCell from "../../../components/ui/table/ImageCell";
import ImageModal from "../../../components/ui/modal/ImageModal";

const Programs = () => {
  let navigate = useNavigate();

  const handleToggleStatus = (programId, currentStatus) => {
    toggleProgramStatus(programId, currentStatus, setProgramsData, navigate);
  };

  const columns = [
    { key: "program_name", label: "Program Name" },
    { key: "description", label: "Description" },
    {
      key: "img_url",
      label: "Program Photo",
      render: (value, row) => (
        <ImageCell
          src={row.img_url}
          alt={`${row.program_name} program image`}
          size="md"
          fallbackText="No Image"
          clickable={!!row.img_url}
          onClick={() => {
            setSelectedImage({
              src: row.img_url,
              title: `${row.program_name} Program Image`,
            });
            setIsImageModalOpen(true);
          }}
        />
      ),
    },
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
  const [programsData, setProgramsData] = useState([]);
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
  let paginatedData = programsData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(programsData.length / rowsPerPage);

  // Debounced fetch function
  const fetchCourses = async (query) => {
    setIsLoading(true);
    try {
      let supabaseQuery = Supabase.from("programs").select("*");

      if (query.trim() !== "") {
        supabaseQuery = supabaseQuery.ilike(
          "program_name",
          `%${query.trim()}%`
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        toast.error("Search error: " + error.message);
        console.error("Supabase search error:", error);
        return;
      }

      setProgramsData(data);
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
  //   paginatedData = programsData.filter(
  //     (course) => course.course_name.toLowerCase().includes(value.toLowerCase())
  //     // console.log(course.course_name.toLowerCase().includes(value.toLowerCase().trim()),'course')
  //   );
  //   setCurrentPage(1);
  // };

  useEffect(() => {
    getPrograms();
  }, []);

  const getPrograms = async () => {
    try {
      setIsLoading(true);
      let { data: programs, error } = await Supabase.from("programs").select(
        "*"
      );
      if (error) {
        toast.error(error?.message);
        console.error("Programs List Error:", error.message);
        return;
      }
      setProgramsData(programs);
      setIsLoading(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const { error } = await Supabase.from("programs").delete().eq("id", id);

      if (error) {
        toast.error(error.message);
        console.error("Programs Delete Error:", error.message);
        return;
      }

      await getPrograms(); // wait for table refresh before closing modal

      toast.success("Program record deleted successfully");
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
      <PageBreadcrumb pageTitle="Programs List" />
      <div className="space-y-6">
        <ComponentCard title="Programs List">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <CustomTable
                columns={columns}
                data={paginatedData}
                loading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onEdit={(program) => navigate(`/programs/edit/${program.id}`)}
                onDelete={(program) => {
                  setItemToDelete(program);
                  setIsDeleteModalOpen(true);
                }}
                showSearch={true}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search programs..."
                showAddButton={true}
                addButtonText="Add Program"
                onAddClick={() => navigate("/programs/add")}
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
            Are you sure you want to delete this program record?
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

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setSelectedImage({ src: null, title: "" });
        }}
        src={selectedImage.src}
        alt="Program Image"
        title={selectedImage.title}
      />
    </>
  );
};

export default Programs;

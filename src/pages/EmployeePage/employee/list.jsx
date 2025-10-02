import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import CustomTable from "../../Tables/CustomTable";
import { useNavigate } from "react-router";
import { useState } from "react";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const tableData = [
    {
      id: 1,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Lindsey Curtis",
        role: "Web Designer",
      },
      department: "Design",
      projectName: "7585474745",
      team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
      budget: "3.9K",
      status: "Active",
    },
    {
      id: 2,
      user: {
        image: "/images/user/user-18.jpg",
        name: "Kaiya George",
        role: "Project Manager",
      },
      projectName: "8000987654",
      team: {
        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
      },
      budget: "24.9K",
      department: "Management",
      status: "Pending",
    },
    {
      id: 3,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Zain Geidt",
        role: "Content Writing",
      },
      projectName: "7000854321",
      team: {
        images: ["/images/user/user-27.jpg"],
      },
      budget: "12.7K",
      department: "Content",
      status: "Active",
    },
    {
      id: 4,
      user: {
        image: "/images/user/user-20.jpg",
        name: "Abram Schleifer",
        role: "Digital Marketer",
      },
      projectName: "9587965874",
      team: {
        images: [
          "/images/user/user-28.jpg",
          "/images/user/user-29.jpg",
          "/images/user/user-30.jpg",
        ],
      },
      budget: "2.8K",
      department: "Marketing",
      status: "Cancel",
    },
    {
      id: 5,
      user: {
        image: "/images/user/user-21.jpg",
        name: "Carla George",
        role: "Front-end Developer",
      },

      projectName: "9098787474",
      team: {
        images: [
          "/images/user/user-31.jpg",
          "/images/user/user-32.jpg",
          "/images/user/user-33.jpg",
        ],
      },
      budget: "4.5K",
      department: "Development",
      status: "Active",
    },
    {
      id: 6,
      user: {
        image: "/images/user/user-22.jpg",
        name: "Derek Blue",
        role: "Back-end Developer",
      },
      projectName: "9098787474",
      team: {
        images: [
          "/images/user/user-34.jpg",
          "/images/user/user-35.jpg",
          "/images/user/user-36.jpg",
        ],
      },
      budget: "5.5K",
      department: "Development",
      status: "Active",
    },
    {
      id: 7,
      user: {
        image: "/images/user/user-23.jpg",
        name: "Eva Green",
        role: "UI/UX Designer",
      },
      projectName: "9098787474",
      team: {
        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
      },
      budget: "3.5K",
      department: "Design",
      status: "Active",
    },
    {
      id: 8,
      user: {
        image: "/images/user/user-24.jpg",
        name: "Frank White",
        role: "Data Analyst",
      },
      projectName: "9098787474",
      team: {
        images: [
          "/images/user/user-31.jpg",
          "/images/user/user-32.jpg",
          "/images/user/user-33.jpg",
        ],
      },
      budget: "6.5K",
      department: "Analytics",
      status: "Active",
    },

    {
      id: 9,
      user: {
        image: "/images/user/user-25.jpg",
        name: "Grace Black",
        role: "SEO Specialist",
      },
      projectName: "9098787474",
      team: {
        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
      },
      budget: "2.5K",
      department: "SEO",
      status: "Active",
    },
    {
      id: 10,
      user: {
        image: "/images/user/user-26.jpg",
        name: "Hank Grey",
        role: "System Administrator",
      },
      projectName: "9098787474",
      team: {
        images: [
          "/images/user/user-34.jpg",
          "/images/user/user-35.jpg",
          "/images/user/user-36.jpg",
        ],
      },
      budget: "3.0K",
      department: "IT Support",
      status: "Active",
    },

    {
      id: 11,
      user: {
        image: "/images/user/user-27.jpg",
        name: "Ivy Brown",
        role: "Content Strategist",
      },
      projectName: "9098787474",
      team: {
        images: [
          "/images/user/user-34.jpg",
          "/images/user/user-35.jpg",
          "/images/user/user-36.jpg",
        ],
      },
      budget: "4.0K",
      department: "Content Strategy",
      status: "Active",
    },
    {
      id: 12,
      user: {
        image: "/images/user/user-28.jpg",
        name: "Jack Smith",
        role: "Network Engineer",
      },
      projectName: "9098787474",
      team: {
        images: [
          "/images/user/user-34.jpg",
          "/images/user/user-35.jpg",
          "/images/user/user-36.jpg",
        ],
      },
      budget: "5.0K",
      department: "Network Engineering",
      status: "Active",
    },
  ];

  const columns = [
    {
      key: "user",
      label: "Name",
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.image}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.role}
            </p>
          </div>
        </div>
      ),
    },
    { key: "projectName", label: "Contact No" },
    { key: "budget", label: "Salary (INR)" },
    { key: "department", label: "Department" },
    {
      key: "team",
      label: "Students",
      render: (team) => (
        <div className="flex -space-x-2">
          {team.images.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Student"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
            />
          ))}
          {team.images.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
              +{team.images.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  const rowsPerPage = 10;

  // Filter data based on search
  const filteredData = tableData.filter(
    (item) =>
      item.user.name.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
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
            onDelete={(employee) => console.log("Delete employee:", employee)}
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
    </>
  );
};

export default EmployeeList;

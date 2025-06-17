import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableOne";

const EmployeeList = () => {
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

  const tableHeaders = [
    "User",
    "Contact No",
    "Salary",
    "Department",
    "Students",
    "Status",
    "Actions",
  ];

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Employee List" />
      <div className="space-y-6">
        <ComponentCard title="Employee List">
          <BasicTableOne
            tableData={tableData}
            tableHeaders={tableHeaders}
            path="/employees/add"
            editPath="/employees/edit"
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default EmployeeList;

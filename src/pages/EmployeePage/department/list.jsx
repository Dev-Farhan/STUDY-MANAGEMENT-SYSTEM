import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne from "../../../components/tables/BasicTables/BasicTableOne";

const DepartmentList = () => {
  // Define the table data using the interface
  const tableData = [
    {
      id: 1,
      department: "Design",
      status: "Active",
    },
    {
      id: 2,
      department: "Development",
      status: "Pending",
    },
    {
      id: 3,
      department: "Marketing",
      status: "Active",
    },
    {
      id: 4,
      department: "Sales",
      status: "Inactive",
    },
    {
      id: 5,
      department: "Human Resources",
      status: "Active",
    },
  ];

  const tableHeaders = [
    "Department Name",
    // "Contact No",
    // "Salary",
    // "Department",
    // "Students",
    "Status",
    "Actions",
  ];

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Department List" />
      <div className="space-y-6">
        <ComponentCard title="Department List">
          <BasicTableOne
            tableData={tableData}
            tableHeaders={tableHeaders}
            path="/department/add"
            editPath="/department/edit"
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default DepartmentList;

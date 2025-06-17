import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DynamicFields from "../../../components/form/form-elements/DynamicFields";

export default function EmployeeAdd() {
  let fields = [
    {
      type: "text",
      label: "First Name",
      placeholder: "Enter first name",
      name: undefined,
    },
    {
      type: "text",
      label: "Last Name",
      placeholder: "Enter last name",
      name: undefined,
    },
    {
      type: "email",
      label: "Email",
      placeholder: "info@gmail.com",
      name: undefined,
    },
    {
      type: "phone",
      label: "Mobile Number",
      placeholder: "+1 (555) 000-0000",
      selectPosition: "start",
      name: undefined,
    },
    {
      type: "select",
      label: "Department",
      name: "department",
      options: [
        { value: "marketing", label: "Marketing" },
        { value: "development", label: "Development" },
        { value: "design", label: "Design" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
      ],
      placeholder: "Select a department",
    },
    {
      type: "select",
      label: "Gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
      placeholder: "Select a gender",
    },
    {
      type: "date",
      label: "Date of Joining",
      name: "doj", // this is used in formData and onChange
      placeholder: "Select your joining date",
    },
    {
      type: "text",
      name: "basicSalary",
      label: "Basic Salary per Month",
      placeholder: "Enter your salary",
      grid: "col-span-1", // optional: for layout control
    },
    {
      type: "textarea",
      label: "Address",
      name: "address",
      placeholder: "Enter your full address",
      rows: 4,
      // grid: "col-span-2",
    },
  ];
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Employee Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <DynamicFields fields={fields} />
      </div>
    </div>
  );
}

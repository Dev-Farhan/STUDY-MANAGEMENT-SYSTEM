import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DynamicFields from "../../../components/form/form-elements/DynamicFields";

export default function DepartmentEdit() {
  let fields = [
    {
      type: "text",
      label: "Department Name",
      placeholder: "Enter department name",
      name: undefined,
    },
  ];
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Department Edit" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <DynamicFields fields={fields} btntitle="Edit" />
      </div>
    </div>
  );
}

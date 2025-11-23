import { useForm } from "react-hook-form";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Label from "../../../components/form/Label";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Input from "../../../components/form/input/InputField";
import { toast } from "react-toastify";
import Supabase from "../../../config/supabaseClient.ts";

const schema = yup.object().shape({
  department_name: yup
    .string()
    .required("Course name is required field")
    .min(3, "Course name must be at least 3 characters"),
});
export default function DepartmentAdd() {
  let navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);

    try {
      const { data, error } = await Supabase.from("department")
        .insert([formData])
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Department Add Error:", error.message);
        return;
      }

      reset();
      toast.success("Department added successfully!");
      navigate("/employees/department");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Department Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <ComponentCard title="Fill details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <div>
                <Label htmlFor="input">Department Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("department_name")}
                  error={!!errors.department_name}
                  hint={errors.department_name?.message}
                  placeholder={`Enter department name`}
                />
              </div>
            </div>
            <div className="w-full  flex items-center justify-between gap-2 mt-4">
              <Button
                type="button"
                className="w-[10%] px-10 "
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
              <Button className="w-[10%] px-10" size="sm">
                Add
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

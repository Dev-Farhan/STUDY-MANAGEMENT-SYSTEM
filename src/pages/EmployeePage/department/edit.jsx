import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Supabase from "../../../config/supabaseClient.ts";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
  department_name: yup
    .string()
    .required("Department name is required field")
    .min(3, "Department name must be at least 3 characters"),
});

export default function DepartmentEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [departmentData, setDepartmentData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      department_name: "",
    },
  });

  useEffect(() => {
    if (id) {
      getDepartmentData(id);
    }
  }, [id]);

  const getDepartmentData = async (departmentId) => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const {
        data: { session },
      } = await Supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to edit departments");
        navigate("/sign-in");
        return;
      }

      const { data, error } = await Supabase.from("department")
        .select("*")
        .eq("id", departmentId)
        .single();

      if (error) {
        toast.error(error?.message);
        console.error("Error fetching department:", error);
        navigate("/employees/department");
        return;
      }

      console.log("Department data fetched:", data);
      setDepartmentData(data);
      reset(data);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
      navigate("/employees/department");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);

    try {
      setIsLoading(true);

      // Check if user is authenticated
      const {
        data: { session },
      } = await Supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to update departments");
        navigate("/sign-in");
        return;
      }

      const { department_name } = formData;

      const { data, error } = await Supabase.from("department")
        .update({ department_name })
        .eq("id", departmentData.id)
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Department Edit Error:", error.message);
        return;
      }

      toast.success("Department updated successfully!");
      navigate("/employees/department");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !departmentData.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading department data...</div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Department Edit | Study Management System"
        description="Edit department information in the study management system"
      />
      <PageBreadcrumb pageTitle="Department Edit" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <ComponentCard title="Edit Department Details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department_name">Department Name</Label>
                <Input
                  type="text"
                  id="department_name"
                  {...register("department_name")}
                  error={!!errors.department_name}
                  hint={errors.department_name?.message}
                  placeholder="Enter department name"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-2 mt-4">
              <Button
                type="button"
                className="w-[10%] px-10"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/employees/department");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-[10%] px-10"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

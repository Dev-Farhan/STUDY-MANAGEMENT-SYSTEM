import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
// import DynamicFields from "../../../components/form/form-elements/DynamicFields";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Supabase from "../../../config/supabaseClient.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea.tsx";
import { useEffect, useState } from "react";
import { get } from "lodash";
import Select from "../../../components/form/Select.tsx";
const schema = yup.object().shape({
  program_name: yup
    .mixed()
    .transform((value) => (value && value.id ? value.id : ""))
    .required("Program name is required"),
  course_name: yup
    .string()
    .required("Course name is required field")
    .min(3, "Course name must be at least 3 characters"),

  course_code: yup
    .string()
    .required("Course code is required field")
    .min(6, "Course code must be at least 6 characters"),

  fee: yup
    .string()
    .required("Fees is required field")
    .matches(/^[0-9]+$/, "Fees must be a valid number"),

  duration: yup
    .string()
    .required("Duration is required field")
    .matches(/^[0-9]+$/, "Duration must be a valid number (in months/years)"),

  description: yup
    .string()
    .required("Description is required field")
    .min(10, "Description must be at least 10 characters"),
});

export default function CourseAdd() {
  let navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "", // Make sure this matches the field name
    },
  });

  useEffect(() => {
    getPrograms();
  }, []);

  const getPrograms = async () => {
    try {
      const { data, error } = await Supabase.from("programs").select();
      if (error) {
        console.error("Error fetching programs:", error);
        toast.error("Failed to fetch programs");
        return;
      }
      console.log("Programs Data:", data);
      // Assuming you want to set the programs in a state or use them directly
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to fetch programs");
    }
  };

  const onSubmit = async (formData) => {
    toast.dismiss();
    console.log("Form Data:", formData);
    const { program_name, ...rest } = formData;

    const transformData = { ...rest, program_id: program_name };
    console.log("llllllllllllllllllllll", transformData);
    try {
      const { data, error } = await Supabase.from("courses")
        .insert([transformData]) // use [formData] to insert as a row
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Course Add Error:", error.message);
        return;
      }

      reset(); // clear form fields
      toast.success("Course added successfully!");
      navigate("/courses");
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
      <PageBreadcrumb pageTitle="Course Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* <DynamicFields fields={fields}  /> */}
        <ComponentCard title="Fill details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <div>
                <Label htmlFor="program_name">Program Name</Label>
                <Controller
                  name="program_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={programs.map((program) => ({
                        value: program.program_name,
                        label: program.program_name,
                        id: program.id,
                      }))}
                      placeholder="Select Program"
                      error={!!errors.program_name}
                      hint={
                        errors.program_name?.message ||
                        "Program name is required field"
                      }
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="input">Course Code</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("course_code")}
                  error={!!errors.course_code}
                  hint={errors.course_code?.message}
                  placeholder={`Enter course code`}
                />
              </div>
              <div>
                <Label htmlFor="input">Course Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("course_name")}
                  error={!!errors.course_name}
                  hint={errors.course_name?.message}
                  placeholder={`Enter course name`}
                />
              </div>
              <div>
                <Label htmlFor="input">Course Fee</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("fee")}
                  error={!!errors.fee}
                  hint={errors.fee?.message}
                  placeholder={`Enter course fee`}
                />
              </div>
              <div>
                <Label htmlFor="input">Course Duration</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("duration")}
                  error={!!errors.duration}
                  hint={errors.duration?.message}
                  placeholder={`Enter course duration in months`}
                />
              </div>
              <div>
                {/* <Label>Description</Label>
                <TextArea
                  {...register("description")}
                  error={!!errors.description}
                  hint={errors.description?.message}
                  placeholder="Enter description"
                   value={""}
                  onChange={(value) => {}}
                  rows={6}
                /> */}
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={6}
                      error={!!errors.description}
                      hint={errors.description?.message}
                      placeholder="Enter description"
                    />
                  )}
                />
              </div>
            </div>
            <div className="w-full  flex items-center justify-between gap-2 mt-4">
              <Button
                type="button"
                className="w-[10%] px-10 "
                size="sm"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-[10%] px-10" size="sm">
                Add
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

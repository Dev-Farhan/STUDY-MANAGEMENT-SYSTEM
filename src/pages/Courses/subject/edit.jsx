import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Supabase from "../../../config/supabaseClient.ts";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField";
import { useEffect, useState } from "react";
import Select from "../../../components/form/Select.tsx";
const schema = yup.object().shape({
  program_name: yup
    .object()
    .nullable()
    .required("Program name is required")
    .test(
      "program-value",
      "Program name is required",
      (value) => !!value?.value
    ),

  course_name: yup
    .object()
    .nullable()
    .required("Course name is required")
    .test("course-value", "Course name is required", (value) => !!value?.value),
  subject_code: yup
    .string()
    .required("Subject code is required field")
    .min(6, "Subject code must be at least 6 characters"),

  subject_name: yup
    .string()
    .required("Subject name is required field")
    .min(3, "Subject name must be at least 3 characters"),
  total_marks: yup
    .string()
    .required("Total marks is required field")
    .matches(/^[0-9]+$/, "Total marks must be a valid number"),
});

export default function SubjectEdit() {
  let navigate = useNavigate();
  let { id } = useParams();
  const [programs, setPrograms] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { program_name: null, course_name: null },
  });
  const getSubject = async (subjectId) => {
    if (!programs.length) return; // programs not loaded yet

    const { data, error } = await Supabase.from("subject")
      .select(
        `
      *,
      programs(id, program_name),
      courses(id, course_name)
    `
      )
      .eq("id", subjectId)
      .single();

    // ...same mapping as before
    const program = programs.find((p) => p.id === data.programs.id);
    setFilteredCourses(program?.courses || []);
    reset({
      program_name: {
        value: data.programs.program_name,
        label: data.programs.program_name,
        id: data.programs.id,
      },
      course_name: {
        value: data.courses.course_name,
        label: data.courses.course_name,
        id: data.courses.id,
      },
      subject_code: data.subject_code,
      subject_name: data.subject_name,
      total_marks: data.total_marks,
    });
  };

  useEffect(() => {
    if (programs.length && id) {
      getSubject(id);
    }
  }, [programs, id]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await Supabase.from("programs").select(
        "*, courses(*)"
      );
      if (error) {
        toast.error("Failed to fetch programs and courses");
        console.error(error);
        return;
      }
      setPrograms(data);
    };
    fetchData();
  }, []);

  const onSubmit = async (formData) => {
    toast.dismiss();
    // console.log("Form Data:", formData);
    try {
      const payload = {
        program_id: formData.program_name?.id,
        course_id: formData.course_name?.id,
        subject_name: formData.subject_name,
        subject_code: formData.subject_code,
        total_marks: formData.total_marks,
      };

      console.log("Final Payload:", payload);
      const { data, error } = await Supabase.from("subject")
        .insert([payload])
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Subject Add Error:", error.message);
        return;
      }

      reset(); // clear form fields
      toast.success("Subject added successfully!");
      navigate("/subject");
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
      <PageBreadcrumb pageTitle="Subject Edit" />
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
                      onChange={(selectedOption) => {
                        // Update form value
                        field.onChange(selectedOption);

                        // Filter the corresponding courses
                        const selectedProgram = programs.find(
                          (p) => p.program_name === selectedOption?.value
                        );
                        setFilteredCourses(selectedProgram?.courses || []);

                        // Also reset the course field when program changes
                        setValue("course_name", null);
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="course_name">Course Name</Label>
                <Controller
                  name="course_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={filteredCourses.map((course) => ({
                        value: course.course_name,
                        label: course.course_name,
                        id: course.id,
                      }))}
                      placeholder={
                        filteredCourses.length
                          ? "Select Course"
                          : "Select a Program first"
                      }
                      isDisabled={!filteredCourses.length}
                      error={!!errors.course_name}
                      hint={
                        errors.course_name?.message ||
                        "Course name is required field"
                      }
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="input">Subject Code</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("subject_code")}
                  error={!!errors.subject_code}
                  hint={errors.subject_code?.message}
                  placeholder={`Enter subject code`}
                />
              </div>
              <div>
                <Label htmlFor="input">Subject Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("subject_name")}
                  error={!!errors.subject_name}
                  hint={errors.subject_name?.message}
                  placeholder={`Enter subject name`}
                />
              </div>
              <div>
                <Label htmlFor="input">Total Marks</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("total_marks")}
                  error={!!errors.total_marks}
                  hint={errors.total_marks?.message}
                  placeholder={`Enter total marks`}
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

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
import DynamicFileUploader from "../../../components/form/form-elements/FileInputExample.tsx";
import { formatDate } from "@fullcalendar/core/index.js";
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
  subject_name: yup
    .object()
    .nullable()
    .required("Syllabus name is required")
    .test(
      "syllabus-value",
      "Syllabus name is required",
      (value) => !!value?.value
    ),
  video_url: yup
    .string()
    .required("File name is required field")
    .min(3, "File name must be at least 3 characters"),
  video_code: yup
    .string()
    .required()
    .min(3, "Code must be at list 3 characthers"),
  // .matches(/^[0-9]+$/, "Total marks must be a valid number"),

  // file_url: yup.mixed().required("File upload is required"),
});

export default function VideoClassAdd() {
  let navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await Supabase.from("programs").select(
        "*, courses(*, subject(*))"
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

  // const onSubmit = async (formData) => {
  //   toast.dismiss();
  //   console.log("Form Data:", formData);
  //   // try {
  //   //   const payload = {
  //   //     program_id: formData.program_name?.id,
  //   //     course_id: formData.course_name?.id,
  //   //     subject_name: formData.subject_name,
  //   //     subject_code: formData.subject_code,
  //   //     total_marks: formData.total_marks,
  //   //   };

  //   //   console.log("Final Payload:", payload);
  //   //   const { data, error } = await Supabase.from("subject")
  //   //     .insert([payload])
  //   //     .select();

  //   //   if (error) {
  //   //     toast.error(error?.message);
  //   //     console.error("Subject Add Error:", error.message);
  //   //     return;
  //   //   }

  //   //   reset(); // clear form fields
  //   //   toast.success("Subject added successfully!");
  //   //   navigate("/subject");
  //   // } catch (err) {
  //   //   toast.error(err?.message || "Something went wrong");
  //   //   console.error("Unexpected Error:", err);
  //   // }
  // };
  const [selectedFile, setSelectedFile] = useState(null);
  const onSubmit = async (formData) => {
    toast.dismiss();

    try {
      const { data: user } = await Supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload files.");
        return;
      }
      const payload = {
        program_id: formData.program_name.id,
        course_id: formData.course_name.id,
        subject_id: formData.subject_name.id,
        video_url: formData.video_url,
        video_code: formData.video_code,
      };
      console.log("Payloads", payload);
      const { error: dbError } = await Supabase.from("videoclasses").insert([
        payload,
      ]);
      if (dbError) throw dbError;

      toast.success("Video class added successfully!");
      reset();
      navigate("/video-classes");
    } catch (error) {
      console.error("Upload Error:", error.message);
      toast.error("Upload failed!");
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Video Class Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* <DynamicFields fields={fields}  /> */}
        <ComponentCard title="Fill details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <div>
                {/* Program Select */}
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

                        // Reset dependent fields
                        setValue("course_name", null);
                        setValue("subject_name", null);
                        setFilteredSubjects([]);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                {/* Course Select */}
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
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);

                        // Find selected course
                        const selectedCourse = filteredCourses.find(
                          (c) => c.course_name === selectedOption?.value
                        );
                        console.log(selectedCourse);
                        // Set related subjects (depends on how you structure course → subjects)
                        setFilteredSubjects(selectedCourse?.subject || []);

                        // Reset subject when course changes
                        setValue("subject_name", null);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                {/* Subject Select */}
                <Label htmlFor="subject_name">Subject Name</Label>
                <Controller
                  name="subject_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={filteredSubjects.map((subject) => ({
                        value: subject.subject_name,
                        label: subject.subject_name,
                        id: subject.id,
                      }))}
                      placeholder={
                        filteredSubjects.length
                          ? "Select Subject"
                          : "Select a Course first"
                      }
                      isDisabled={!filteredSubjects.length}
                      error={!!errors.subject_name}
                      hint={
                        errors.subject_name?.message ||
                        "Subject name is required field"
                      }
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="input">Video URL</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("video_url")}
                  error={!!errors.video_url}
                  hint={errors.video_url?.message}
                  placeholder={`Enter video url`}
                />
              </div>

              <div>
                <Label htmlFor="input">Video Code</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("video_code")}
                  error={!!errors.video_code}
                  hint={errors.video_code?.message}
                  placeholder={`Enter video code`}
                />
              </div>
            </div>
            <div className="w-full  flex items-center justify-between gap-2 mt-4">
              <Button
                className="w-[10%] px-10 "
                size="sm"
                variant="outline"
                onClick={() => navigate("/syllabus")}
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

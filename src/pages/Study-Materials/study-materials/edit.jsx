import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
// import DynamicFields from "../../../components/form/form-elements/DynamicFields";
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
import TextArea from "../../../components/form/input/TextArea.tsx";
import { useEffect, useState } from "react";
import { get } from "lodash";
import Select from "../../../components/form/Select.tsx";
import DynamicFileUploader from "../../../components/form/form-elements/FileInputExample.tsx";
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
  file_name: yup
    .string()
    .required("File name is required field")
    .min(3, "File name must be at least 3 characters"),
  // .matches(/^[0-9]+$/, "Total marks must be a valid number"),

  // file_url: yup.mixed().required("File upload is required"),
});

export default function StudyMaterialEdit() {
  let navigate = useNavigate();
  let { id } = useParams();
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
    const fetchSyllabusById = async () => {
      if (!id) return;

      const { data, error } = await Supabase.from("studymaterial")
        .select(
          `
        *,
        programs:program_id (id, program_name),
        courses:course_id (id, course_name),
        subject:subject_id (id, subject_name)
      `
        )
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Failed to fetch syllabus data");
        console.error(error);
        return;
      }

      // Populate fields
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
        subject_name: {
          value: data.subject.subject_name,
          label: data.subject.subject_name,
          id: data.subject.id,
        },
        file_name: data.filename || "",
      });

      // Dynamically set related course and subject lists
      const selectedProgram = programs.find((p) => p.id === data.program_id);
      setFilteredCourses(selectedProgram?.courses || []);

      const selectedCourse = selectedProgram?.courses.find(
        (c) => c.id === data.course_id
      );
      setFilteredSubjects(selectedCourse?.subject || []);

      setSelectedFile({ name: data.filename, url: data.file_url });
    };

    // Run fetch only after programs are loaded (to prevent null dropdowns)
    if (programs.length > 0) fetchSyllabusById();
  }, [id, programs]);

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

  const [selectedFile, setSelectedFile] = useState(null);
  const onSubmit = async (formData) => {
    toast.dismiss();

    try {
      // ✅ Get logged-in user
      const { data, error: userError } = await Supabase.auth.getUser();
      const user = data?.user;

      if (userError || !user) {
        toast.error("You must be logged in to perform this action.");
        return;
      }

      let fileUrl = selectedFile?.url; // keep old URL if no new file uploaded
      let fileName = selectedFile?.name;

      // ✅ If user selected a new file
      if (selectedFile instanceof File) {
        // 🧹 1️⃣ Delete old file if it exists
        if (fileUrl) {
          try {
            // Extract the relative path from the full URL
            const oldPath = fileUrl.split(
              "/storage/v1/object/public/study-material_files/"
            )[1];
            if (oldPath) {
              const { error: delError } = await Supabase.storage
                .from("study-material_files")
                .remove([oldPath]);
              if (delError)
                console.warn("Failed to delete old file:", delError);
            }
          } catch (delErr) {
            console.warn("Old file delete failed:", delErr.message);
          }
        }

        // 🆕 2️⃣ Upload new file
        const newFileName = `${Date.now()}_${selectedFile.name}`;
        const filePath = `uploads/${newFileName}`;

        const { error: uploadError } = await Supabase.storage
          .from("study-material_files")
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // 🌐 3️⃣ Get public URL of new file
        const { data: publicUrlData } = Supabase.storage
          .from("study-material_files")
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
        fileName = selectedFile.name;
      }

      // 🧾 4️⃣ Prepare update payload
      const payload = {
        program_id: formData.program_name.id,
        course_id: formData.course_name.id,
        subject_id: formData.subject_name.id,
        filename: fileName,
        file_url: fileUrl,
      };

      // 💾 5️⃣ Update syllabus record
      const { error: updateError } = await Supabase.from("studymaterial")
        .update(payload)
        .eq("id", id);

      if (updateError) throw updateError;

      // ✅ Success
      toast.success("Study material updated successfully!");
      navigate("/study-materials");
    } catch (error) {
      console.error("Update Error:", error.message);
      toast.error("Update failed!");
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Syllabus Edit" />
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
                <Label htmlFor="input">File Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("file_name")}
                  error={!!errors.file_name}
                  hint={errors.file_name?.message}
                  placeholder={`Enter file name`}
                />
              </div>
              <div>
                <Label htmlFor="input">Upload File</Label>
                {/* <DynamicFileUploader /> */}
                <Controller
                  name="file_url"
                  control={control}
                  render={({ field }) => (
                    <DynamicFileUploader
                      existingFile={selectedFile}
                      onFileSelect={(file) => setSelectedFile(file)}
                    />
                  )}
                />
                {errors.file_url && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.file_url.message}
                  </p>
                )}
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
              <Button type="submit" className="w-[10%] px-10" size="sm">
                Update
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

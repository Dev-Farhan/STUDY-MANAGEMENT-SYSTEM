import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
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
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "../../../config/cloudinaryConfig";
const schema = yup.object().shape({
  program_name: yup
    .string()
    .required("Course name is required field")
    .min(3, "Course name must be at least 3 characters"),

  description: yup
    .string()
    .required("Description is required field")
    .min(10, "Description must be at least 10 characters"),

  program_image: yup
    .mixed()
    .nullable()
    .test("fileType", "Only image files are allowed", function (value) {
      if (!value) return true; // Allow empty/null values
      return (
        value &&
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/svg+xml",
        ].includes(value.type)
      );
    })
    .test("fileSize", "File size must be less than 5MB", function (value) {
      if (!value) return true; // Allow empty/null values
      return value && value.size <= 5 * 1024 * 1024; // 5MB
    }),
});

export default function ProgramAdd() {
  let navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      program_image: null,
    },
  });

  // Handle image upload with dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedImage(file);
      setValue("program_image", file);
      clearErrors("program_image");

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("program_image", null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Cleanup image preview URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);

    try {
      setIsUploading(true);
      let imageUrl = null;

      // If an image is selected, upload it to Cloudinary first
      if (selectedImage) {
        toast.info("Uploading image to Cloudinary...");

        const uploadResult = await uploadImageToCloudinary(selectedImage);

        if (!uploadResult.success) {
          toast.error(`Image upload failed: ${uploadResult.error}`);
          setIsUploading(false);
          return;
        }

        imageUrl = uploadResult.url;
        toast.success("Image uploaded successfully!");
      }

      // Prepare data for database insertion
      const dataToInsert = {
        program_name: formData.program_name,
        description: formData.description,
        ...(imageUrl && { img_url: imageUrl }), // Include image URL if available
      };

      const { data, error } = await Supabase.from("programs")
        .insert([dataToInsert])
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Program Add Error:", error.message);
        setIsUploading(false);
        return;
      }

      reset(); // clear form fields
      removeImage(); // clear image
      setIsUploading(false);
      toast.success("Program added successfully!");
      navigate("/programs");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Program Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* <DynamicFields fields={fields}  /> */}
        <ComponentCard title="Fill details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-1  gap-4">
              <div>
                <Label htmlFor="input">Program Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("program_name")}
                  error={!!errors.program_name}
                  hint={errors.program_name?.message}
                  placeholder={`Enter program name`}
                />
              </div>
              <div>
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

            {/* Image Upload Section */}
            <div className="mt-6">
              <Label>Program Image</Label>
              <div className="mt-2">
                {!selectedImage ? (
                  <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                    <div
                      {...getRootProps()}
                      className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
                        isDragActive
                          ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                          : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="dz-message flex flex-col items-center m-0">
                        {/* Icon Container */}
                        <div className="mb-[22px] flex justify-center">
                          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                            <svg
                              className="fill-current"
                              width="29"
                              height="28"
                              viewBox="0 0 29 28"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Text Content */}
                        <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                          {isDragActive
                            ? "Drop Image Here"
                            : "Drag & Drop Program Image Here"}
                        </h4>

                        <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                          Drag and drop your PNG, JPG, WebP, SVG images here or
                          browse (Max 5MB)
                        </span>

                        <span className="font-medium underline text-theme-sm text-brand-500">
                          Browse File
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Program preview"
                      className="w-full max-w-xs h-48 object-cover border border-gray-200 rounded-xl dark:border-gray-800"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedImage.name} (
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
                {errors.program_image && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.program_image.message}
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
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-[10%] px-10"
                size="sm"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Add"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

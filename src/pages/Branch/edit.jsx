import { useEffect, useState } from "react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
// import DynamicFields from "../../../components/form/form-elements/DynamicFields";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Supabase from "@config/supabaseClient.ts";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "@components/common/ComponentCard.tsx";
import Button from "@components/ui/button/Button.tsx";
import Label from "@components/form/Label.tsx";
import Input from "@components/form/input/InputField";
import Select from "../../components/form/Select";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { uploadImageToCloudinary } from "../../config/cloudinaryConfig";
// import { uploadImageToCloudinary } from "../../../config/cloudinaryConfig";

const API_KEY = import.meta.env.VITE_STATE_CITY_API_KEY;

const schema = yup.object().shape({
  logo_url: yup
    .mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value) => {
      if (!value || typeof value === "string") return true; // Allow empty value or existing URL
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value || typeof value === "string") return true; // Allow empty value or existing URL
      return [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
      ].includes(value.type);
    }),

  center_code: yup.string(), // Just for display, no validation needed

  center_name: yup
    .string()
    .required("Center name is a required field")
    .min(3, "Center name must be at least 6 characters"),

  society_trust_company: yup
    .string()
    .required("Society/trust/company is a required field")
    .min(3, "Society name must be at least 6 characters"),

  reg_no: yup
    .string()
    .required("Registration number is a required")
    .matches(/^[A-Za-z0-9]+$/, "Registration number must be alphanumeric")
    .min(6, "Registration number must be at least 6 characters")
    .max(12, "Registration number must be at most 12 characters"),

  reg_year: yup
    .string()
    .required("Registration year is a required")
    .matches(/^[0-9]+$/, "Registration year must be numeric")
    .max(4, "Registration year must be a valid year"),

  center_address: yup
    .string()
    .required("Center address is a required")
    .min(5, "Center address must be at least 5 characters"),
  contact_no: yup
    .string()
    .required("Contact number is a required")
    .matches(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),

  state: yup
    .object()
    .required("State is required")
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .test("state-required", "State is a required field", (value) => {
      return value && value.value;
    }),
  city: yup
    .object()
    .required("City is required")
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .test("city-required", "City is a required field", (value) => {
      return value && value.value;
    }),

  // Center Head Profile Validations
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  gender: yup
    .object()
    .shape({
      value: yup.string(),
      label: yup.string(),
    })
    .nullable()
    .test("gender-required", "Please select a valid gender", (value) => {
      if (!value) return true; // Allow null for edit mode
      return ["male", "female", "other"].includes(value.value);
    }),

  mobile_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters"),

  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),

  address_proof: yup
    .object()
    .shape({
      value: yup.string(),
      label: yup.string(),
    })
    .nullable()
    .test(
      "address-proof-required",
      "Please select a valid address proof type",
      (value) => {
        if (!value) return true; // Allow null for edit mode
        return [
          "aadhar",
          "passport",
          "driving_license",
          "voter_id",
          "electricity_bill",
        ].includes(value.value);
      }
    ),

  id_number: yup
    .string()
    .required("ID number is required")
    .matches(
      /^[A-Za-z0-9-]+$/,
      "ID number can only contain letters, numbers and hyphens"
    )
    .min(8, "ID number must be at least 8 characters")
    .max(20, "ID number must not exceed 20 characters"),
});

export default function BranchEdit() {
  let navigate = useNavigate();
  let id = useParams();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [branchData, setBranchData] = useState({});

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      logo_url: null,
      state: null,
      city: null,
      gender: null,
      address_proof: null,
    },
  });
  const selectedState = watch("state");

  useEffect(() => {
    if (id) {
      getBranchData(id.id);
    }
  }, [id]);

  const getBranchData = async (branchId) => {
    const { data, error } = await Supabase.from("branch")
      .select("*")
      .eq("id", branchId)
      .single();

    if (error) {
      console.error("Error fetching branch:", error);
      toast.error("Error fetching branch data");
      return;
    }

    setBranchData(data);

    // Format the data for form fields
    const formattedData = {
      ...data,
      // Format select fields
      state: data.state
        ? {
            value: data.state,
            label:
              states.find((s) => s.value === data.state)?.label || data.state,
          }
        : { value: "", label: "Select State" },
      city: data.city
        ? { value: data.city, label: data.city }
        : { value: "", label: "Select City" },
      gender: data.gender
        ? {
            value: data.gender,
            label: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
          }
        : { value: "", label: "Select Gender" },
      address_proof: data.address_proof
        ? {
            value: data.address_proof,
            label:
              {
                aadhar: "Aadhar Card",
                passport: "Passport",
                driving_license: "Driving License",
                voter_id: "Voter ID",
                electricity_bill: "Electricity Bill",
              }[data.address_proof] || data.address_proof,
          }
        : { value: "", label: "Select Address Proof" },
    };

    // Set form values
    reset(formattedData);

    // Set image preview if exists
    if (data.logo_url) {
      setImagePreview(data.logo_url);
    }
  };

  // Handle image upload with dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedImage(file);
      setValue("logo_url", file);
      clearErrors("logo_url");

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
    setValue("logo_url", null);
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

  // 🏙️ Get all states (on load)
  useEffect(() => {
    fetchData();
  }, []);

  // 🏘️ Get cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState.value).then((citiesList) => {
        setCities(citiesList);
      });
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const fetchData = async () => {
    var config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries/IN/states",
      headers: {
        "X-CSCAPI-KEY": API_KEY,
      },
    };

    try {
      const response = await axios(config);
      // const data = response?.data;
      const formattedStates = response?.data.map((state) => ({
        value: state.iso2,
        label: state.name,
      }));
      setStates(formattedStates);
      // console.log("✅ Data received:", response.data);
    } catch (error) {
      console.error("❌ Error fetching data:", error.message || error);
    }
  };

  const fetchCities = async (stateCode) => {
    if (!stateCode) return [];

    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`,
        {
          headers: {
            "X-CSCAPI-KEY": API_KEY,
          },
        }
      );

      return response.data.map((city) => ({
        label: city.name,
        value: city.name,
      }));
    } catch (error) {
      console.error("❌ City fetch error:", error.message);
      return [];
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsUploading(true);
      let logoUrl = null;

      // If an image is selected, upload it to Cloudinary first
      if (selectedImage) {
        toast.info("Uploading image to Cloudinary...");

        const uploadResult = await uploadImageToCloudinary(selectedImage);

        if (!uploadResult.success) {
          toast.error(`Image upload failed: ${uploadResult.error}`);
          setIsUploading(false);
          return;
        }

        logoUrl = uploadResult.url;
        toast.success("Image uploaded successfully!");
      }

      // Prepare data for database insertion
      const dataToInsert = {
        // Center Information
        center_name: formData.center_name,
        society_trust_company: formData.society_trust_company,
        reg_no: formData.reg_no,
        reg_year: formData.reg_year,
        center_address: formData.center_address,
        contact_no: formData.contact_no,
        state: formData.state?.value || branchData.state,
        city: formData.city?.value || branchData.city,

        // Center Head Profile
        name: formData.name,
        gender: formData.gender?.value || branchData.gender,
        mobile_number: formData.mobile_number,
        email: formData.email,
        address: formData.address,
        address_proof:
          formData.address_proof?.value || branchData.address_proof,
        id_number: formData.id_number,

        // Logo URL (if available)
        logo_url: logoUrl || branchData.logo_url, // Keep existing logo if no new one is uploaded
      };

      const { data, error } = await Supabase.from("branch")
        .update(dataToInsert)
        .eq("id", id.id)
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Branch Add Error:", error.message);
        setIsUploading(false);
        return;
      }

      reset(); // clear form fields
      removeImage(); // clear image
      setIsUploading(false);
      toast.success("Branch updated successfully!");
      navigate("/branch");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      console.error("Unexpected Error:", err);
      setIsUploading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Add Branch | Study Management System"
        description="Add a new branch or center to the Study Management System. Register center details, head profile, and location information."
      />
      <PageBreadcrumb pageTitle="Branch Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* <DynamicFields fields={fields}  /> */}
        <ComponentCard title="Fill details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="pb-5 text-base font-medium text-gray-800 dark:text-white/90">
              Center Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
              <div>
                <Label htmlFor="input">Center Code</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("center_code")}
                  error={!!errors.center_code}
                  hint={errors.center_code?.message}
                  placeholder={`Enter center code`}
                  disabled={true}
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="input">Center Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("center_name")}
                  error={!!errors.center_name}
                  hint={errors.center_name?.message}
                  placeholder={`Enter center name`}
                />
              </div>
              <div>
                <Label htmlFor="input">Society/Trust/Company</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("society_trust_company")}
                  error={!!errors.society_trust_company}
                  hint={errors.society_trust_company?.message}
                  placeholder={`Enter society/trust/company`}
                />
              </div>
              <div>
                <Label htmlFor="input">Registration Number</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("reg_no")}
                  error={!!errors.reg_no}
                  hint={errors.reg_no?.message}
                  placeholder={`Enter registration number`}
                />
              </div>
              <div>
                <Label htmlFor="input">Registration Year</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("reg_year")}
                  error={!!errors.reg_year}
                  hint={errors.reg_year?.message}
                  placeholder={`Enter registration year in months`}
                />
              </div>
              <div>
                <Label htmlFor="input">Center Address</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("center_address")}
                  error={!!errors.center_address}
                  hint={errors.center_address?.message}
                  placeholder={`Enter center address `}
                />
              </div>
              <div>
                <Label htmlFor="input">Contact Number</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("contact_no")}
                  error={!!errors.contact_no}
                  hint={errors.contact_no?.message}
                  placeholder={`Enter contact number `}
                />
              </div>
              <div>
                <Label htmlFor="state">Select State</Label>
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={states}
                      placeholder="Select State"
                      error={!!errors.state}
                      hint={errors.state?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="state">Select City</Label>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "City field is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={cities}
                      placeholder={
                        selectedState
                          ? "Select City"
                          : "Please select state first"
                      }
                      isDisabled={!selectedState}
                      error={!!errors.city}
                      hint={errors.city?.message}
                    />
                  )}
                />
              </div>
            </div>
            <h3 className="pb-5 mt-15 text-base font-medium text-gray-800 dark:text-white/90">
              Center Head Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
              <div>
                <Label htmlFor="input">Name</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("name")}
                  error={!!errors.name}
                  hint={errors.name?.message}
                  placeholder={`Enter name`}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ]}
                      placeholder="Select Gender"
                      error={!!errors.gender}
                      hint={errors.gender?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="input">Mobile Number</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("mobile_number")}
                  error={!!errors.mobile_number}
                  hint={errors.mobile_number?.message}
                  placeholder={`Enter mobile number`}
                />
              </div>
              <div>
                <Label htmlFor="input">Email</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("email")}
                  error={!!errors.email}
                  hint={errors.email?.message}
                  placeholder={`Enter email`}
                />
              </div>
              <div>
                <Label htmlFor="input">Address</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("address")}
                  error={!!errors.address}
                  hint={errors.address?.message}
                  placeholder={`Enter address`}
                />
              </div>
              <div>
                <Label htmlFor="address_proof">Address Proof</Label>
                <Controller
                  name="address_proof"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "aadhar", label: "Aadhar Card" },
                        { value: "passport", label: "Passport" },
                        { value: "driving_license", label: "Driving License" },
                        { value: "voter_id", label: "Voter ID" },
                        {
                          value: "electricity_bill",
                          label: "Electricity Bill",
                        },
                      ]}
                      placeholder="Select Address Proof Type"
                      error={!!errors.address_proof}
                      hint={errors.address_proof?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="input">ID Number</Label>
                <Input
                  type="text"
                  id="input"
                  {...register("id_number")}
                  error={!!errors.id_number}
                  hint={errors.id_number?.message}
                  placeholder={`Enter ID number`}
                />
              </div>
              <div className="md:col-span-3">
                <Label>Center Logo</Label>
                <div className="mt-2">
                  {!selectedImage && !imagePreview ? (
                    <div
                      className={`transition border-2 ${
                        errors.logo_url
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-700"
                      } border-dashed cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 rounded-xl`}
                    >
                      <div
                        {...getRootProps()}
                        className={`dropzone rounded-xl p-7 lg:p-10 ${
                          isDragActive
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-900"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="dz-message flex flex-col items-center m-0">
                          <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-brand-400">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>

                          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                            {isDragActive
                              ? "Drop logo here"
                              : "Upload Center Logo"}
                          </h4>

                          <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                            Drag and drop your logo here or click to browse
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Supported formats: PNG, JPG, WebP, SVG (Max 5MB)
                          </p>

                          <button
                            type="button"
                            className="mt-4 px-4 py-2 text-sm font-medium text-brand-500 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                          >
                            Select File
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                        <img
                          src={imagePreview}
                          alt="Center logo preview"
                          className="h-full w-full object-contain p-4"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      {selectedImage && (
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span className="truncate">{selectedImage.name}</span>
                          <span>
                            {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.logo_url && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      {errors.logo_url.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full  flex items-center justify-between gap-2 mt-4">
              <Button
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
                Update
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
// import DynamicFields from "../../../components/form/form-elements/DynamicFields";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Supabase from "@config/supabaseClient.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ComponentCard from "@components/common/ComponentCard.tsx";
import Button from "@components/ui/button/Button.tsx";
import Label from "@components/form/Label.tsx";
import Input from "@components/form/input/InputField";
import Select from "../../components/form/Select";
import axios from "axios";
import { uploadImageToCloudinary } from "../../config/cloudinaryConfig";
import DynamicFileUploader from "../../components/form/form-elements/FileInputExample";
// import { uploadImageToCloudinary } from "../../../config/cloudinaryConfig";

const API_KEY = import.meta.env.VITE_STATE_CITY_API_KEY;

const schema = yup.object().shape({
  logo_url: yup
    .mixed()
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true; // Allow empty value
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true; // Allow empty value
      return [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
      ].includes(value.type);
    }),

  center_code: yup
    .string()
    .required("Center code is a required field")
    .min(5, "Center code must be at least 3 characters"),

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
    .required("Gender is required")
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .test("gender-required", "Please select a valid gender", (value) => {
      return value && ["male", "female", "other"].includes(value.value);
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
    .required("Address proof is required")
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .test(
      "address-proof-required",
      "Please select a valid address proof type",
      (value) => {
        return (
          value &&
          [
            "aadhar",
            "passport",
            "driving_license",
            "voter_id",
            "electricity_bill",
          ].includes(value.value)
        );
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

export default function BranchAdd() {
  let navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
    },
  });
  const selectedState = watch("state");


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
    // const {
    //   data: { user },
    //   error: userError,
    // } = await Supabase.auth.getUser();

    // if (userError || !user) {
    //   toast.error("User not authenticated.");
    //   return;
    // }

    // const formDataWithUser = {
    //   ...formData,
    //   created_by: user.id,
    // };

    try {
      setIsUploading(true);
      let logoUrl = null;

      // If an image is selected, upload it to Supabase Storage first
      if (selectedFile) {
        toast.info("Uploading image...");

        const fileName = `${Date.now()}_${selectedFile.name}`;
        const filePath = `branch_logos/${fileName}`;
        
        const { error: uploadError } = await Supabase.storage
          .from("logo")
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = Supabase.storage
          .from("logo")
          .getPublicUrl(filePath);
          
        logoUrl = publicUrlData.publicUrl;
        toast.success("Image uploaded successfully!");
      }

      // Prepare data for database insertion
      const dataToInsert = {
        // Center Information
        center_code: formData.center_code,
        center_name: formData.center_name,
        society_trust_company: formData.society_trust_company,
        reg_no: formData.reg_no,
        reg_year: formData.reg_year,
        center_address: formData.center_address,
        contact_no: formData.contact_no,
        state: formData.state.value,
        city: formData.city.value,

        // Center Head Profile
        name: formData.name,
        gender: formData.gender.value,
        mobile_number: formData.mobile_number,
        email: formData.email,
        address: formData.address,
        address_proof: formData.address_proof.value,
        id_number: formData.id_number,

        // Logo URL (if available)
        ...(logoUrl && { logo_url: logoUrl }),
      };

      const { data, error } = await Supabase.from("branch")
        .insert([dataToInsert])
        .select();

      if (error) {
        toast.error(error?.message);
        console.error("Branch Add Error:", error.message);
        setIsUploading(false);
        return;
      }

      reset(); // clear form fields
      setSelectedFile(null);
      setIsUploading(false);
      toast.success("Branch added successfully!");
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
              <div className="">
                <Label>Center Logo</Label>
                <div className="mt-2">
                  <DynamicFileUploader
                    onFileSelect={(file) => {
                      setSelectedFile(file);
                      setValue("logo_url", file);
                      clearErrors("logo_url");
                    }}
                    existingFile={
                      selectedFile
                        ? {
                            name: selectedFile.name,
                            url: URL.createObjectURL(selectedFile),
                          }
                        : null
                    }
                    allowedTypes={[
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                      "image/svg+xml",
                    ]}
                    maxSizeMB={5}
                  />
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
                Add
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

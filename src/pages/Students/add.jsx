import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import Button from "../../components/ui/button/Button.tsx";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea.tsx";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Supabase from "../../config/supabaseClient.ts";
import Select from "../../components/form/Select";
import axios from "axios";
import DynamicFields from "../../components/form/form-elements/DynamicFields.jsx";
import { uploadImageToCloudinary } from "../../config/cloudinaryConfig";
import { useDropzone } from "react-dropzone";
import DatePicker from "../../components/form/date-picker.tsx";
import DynamicFileUploader from "../../components/form/form-elements/FileInputExample.tsx";

const API_KEY = import.meta.env.VITE_STATE_CITY_API_KEY;

// Validation schema
const schema = yup.object().shape({
  student_name: yup.string().required("Student name is required").min(3),
  father_name: yup.string().required("Father name is required"),
  mother_name: yup.string().required("Mother name is required"),
  gender: yup.string().required("Please select gender"),
  caste: yup.string().required("Please select caste"),
  marital_status: yup.string().required("Please select marital status"),
  mobile_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  parents_number: yup
    .string()
    .required("Parents contact is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  email: yup.string().required("Enter valid email"),
  qualification: yup.string().required(),
  address: yup.string().required(),
  pincode: yup.string().required(),
  student_image: yup.mixed().nullable(),
  course_code: yup.string().required("Course category is required"),
  course_name: yup.string().required("Course name is required"),
  net_fee: yup.string().required("Net fee is required"),
  discount: yup.string(),
  inquiry_source: yup.string().required("Inquiry source is required"),
  description: yup.string(),
  idCardType: yup.string().required("Please select identity type"),
  id_number: yup.string().required("Id number is required"),
});

export default function StudentAdd() {
  // const navigate = useNavigate();

  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     description: "",
  //   },
  // let navigate = useNavigate();

  // const [states, setStates] = useState([]);
  // const [cities, setCities] = useState([]);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  // const [isUploading, setIsUploading] = useState(false);
  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   reset,
  //   watch,
  //   setValue,
  //   clearErrors,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: {
  //     logo_url: null,
  //   },
  // });
  // const selectedState = watch("state");

  // async function fetchData() {
  //   try {
  //     const response = await axios.get(
  //       "https://api.countrystatecity.in/v1/states",
  //       {
  //         headers: { "X-CSCAPI-KEY": "YOUR_API_KEY" },
  //       }
  //     );
  //     setStates(response.data.map((s) => ({ value: s.name, label: s.name })));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  let navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // const {
  //   control,
  //   register,
  //   handleSubmit,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const selectedState = watch("state");

  // Option lists for selects that store string values in the form
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const casteOptions = [
    { value: "General", label: "General" },
    { value: "OBC", label: "OBC" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "other", label: "Other" },
  ];

  const maritalOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];

  const idCardOptions = [
    { value: "aadhar", label: "Aadhar Card" },
    { value: "passport", label: "Passport" },
    { value: "driving_license", label: "Driving License" },
    { value: "voter_id", label: "Voter ID" },
    { value: "electricity_bill", label: "Electricity Bill" },
  ];

  const qualificationOptions = [
    { value: "10th", label: "10th" },
    { value: "12th", label: "12th" },
    { value: "Diploma", label: "Diploma" },
    { value: "Graduate", label: "Graduate" },
    { value: "Post Graduate", label: "Post Graduate" },
    { value: "Phd", label: "Phd" },
    { value: "Other", label: "Other" },
  ];

  // 🏙️ Get all states (on load)
  useEffect(() => {
    fetchData();
    // fetch programs + courses for course selects
    (async function fetchPrograms() {
      try {
        const { data, error } = await Supabase.from("programs").select(
          "*, courses(*)"
        );
        if (error) {
          console.error("Failed to load programs:", error.message || error);
          return;
        }
        setPrograms(data || []);
      } catch (err) {
        console.error("Unexpected error loading programs:", err);
      }
    })();
  }, []);

  // 🏘️ Get cities when a state is selected (selectedState is stored as the state's value string)
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState).then((citiesList) => {
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

  // Handle image upload with dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedImage(file);
      setValue("student_image", file);
      clearErrors("student_image");

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
    setValue("student_image", null);
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

  const [selectedFile, setSelectedFile] = useState(null);
  const onSubmit = async (formData) => {
    toast.dismiss();

    if (!selectedFile) {
      toast.error("Please select a file before submitting!");
      return;
    }

    try {
      const { data: user } = await Supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload files.");
        return;
      }

      // 1️⃣ Upload file to Supabase Storage
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const filePath = `uploads/${fileName}`;
      const { error: uploadError } = await Supabase.storage
        .from("student_files")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2️⃣ Get public URL
      const { data: publicUrlData } = Supabase.storage
        .from("student_files")
        .getPublicUrl(filePath);
      const fileUrl = publicUrlData.publicUrl;

      // 3️⃣ Insert form + file info into DB
      const payload = {
        student_name: formData.student_name,
        father_name: formData.father_name,
        mother_name: formData.mother_name,
        gender: formData.gender,
        caste: formData.caste,
        marital_status: formData.marital_status.toLowerCase(),
        mobile_number: formData.mobile_number,
        parents_contact: formData.parents_number,
        identity_type: formData.idCardType,
        identity_number: formData.id_number,
        last_qualification: formData.qualification,
        address: formData.address,
        pincode: formData.pincode,
        state: formData.state,
        city: formData.city,
        email: formData.email,
        dob: formData.dob,
        program_id: formData.course_code,
        course_id: formData.course_name,
        net_fee: formData.net_fee,
        discount: formData.discount,
        inquiry_source: formData.inquiry_source,
        student_image: selectedFile.name,
        student_image_url: fileUrl,
      };

      const { error: dbError } = await Supabase.from("students").insert([
        payload,
      ]);
      if (dbError) throw dbError;

      toast.success("Student added successfully!");
      reset();
      navigate("/students");
    } catch (error) {
      console.error("Upload Error:", error.message);
      toast.error("Upload failed!");
    }
  };

  return (
    <div>
      <PageMeta
        title="Add Student | Dashboard"
        description="Add new student details"
      />
      <PageBreadcrumb pageTitle="Student Add" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <ComponentCard title="Personal Details">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Name */}
              <div>
                <Label htmlFor="student_name">Student Name</Label>
                <Input
                  type="text"
                  id="student_name"
                  {...register("student_name")}
                  error={!!errors.student_name}
                  hint={errors.student_name?.message}
                  placeholder="Enter student name"
                />
              </div>
              {/* Father Name */}
              <div>
                <Label htmlFor="father_name">Father Name</Label>
                <Input
                  type="text"
                  id="father_name"
                  {...register("father_name")}
                  error={!!errors.father_name}
                  hint={errors.father_name?.message}
                  placeholder="Enter father name"
                />
              </div>
              {/* Mother Name */}
              <div>
                <Label htmlFor="mother_name">Mother Name</Label>
                <Input
                  type="text"
                  id="mother_name"
                  {...register("mother_name")}
                  error={!!errors.mother_name}
                  hint={errors.mother_name?.message}
                  placeholder="Enter mother name"
                />
              </div>
              {/* Gender */}
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => {
                    const selectedOption =
                      genderOptions.find((o) => o.value === field.value) ||
                      null;
                    return (
                      <Select
                        options={genderOptions}
                        value={selectedOption}
                        onChange={(opt) => field.onChange(opt ? opt.value : "")}
                        placeholder="Select Gender"
                        error={!!errors.gender}
                        hint={errors.gender?.message}
                      />
                    );
                  }}
                />
              </div>
              {/* Caste */}
              <div>
                <Label htmlFor="caste">Caste</Label>
                <Controller
                  name="caste"
                  control={control}
                  render={({ field }) => {
                    const selectedOption =
                      casteOptions.find((o) => o.value === field.value) || null;
                    return (
                      <Select
                        options={casteOptions}
                        value={selectedOption}
                        onChange={(opt) => field.onChange(opt ? opt.value : "")}
                        placeholder="Select Caste"
                        error={!!errors.caste}
                        hint={errors.caste?.message}
                      />
                    );
                  }}
                />
              </div>
              {/* Marital Status */}
              <div>
                <Label htmlFor="marital_status">Marital Status</Label>
                <Controller
                  name="marital_status"
                  control={control}
                  render={({ field }) => {
                    const selectedOption =
                      maritalOptions.find((o) => o.value === field.value) ||
                      null;
                    return (
                      <Select
                        options={maritalOptions}
                        value={selectedOption}
                        onChange={(opt) => field.onChange(opt ? opt.value : "")}
                        placeholder="Select Marital Status"
                        error={!!errors.marital_status}
                        hint={errors.marital_status?.message}
                      />
                    );
                  }}
                />
              </div>
              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  type="text"
                  id="mobile_number"
                  {...register("mobile_number")}
                  error={!!errors.mobile_number}
                  hint={errors.mobile_number?.message}
                  placeholder="Enter mobile number"
                />
              </div>
              {/* Parents Number */}
              <div>
                <Label htmlFor="parents_number">Parents Contact</Label>
                <Input
                  type="text"
                  id="parents_number"
                  {...register("parents_number")}
                  error={!!errors.parents_number}
                  hint={errors.parents_number?.message}
                  placeholder="Enter parents contact"
                />
              </div>
              {/* Identity Type */}
              <div>
                <Label htmlFor="idCardType">Identity Type</Label>
                <Controller
                  name="idCardType"
                  control={control}
                  render={({ field }) => {
                    const selectedOption =
                      idCardOptions.find((o) => o.value === field.value) ||
                      null;
                    return (
                      <Select
                        options={idCardOptions}
                        value={selectedOption}
                        onChange={(opt) => field.onChange(opt ? opt.value : "")}
                        placeholder="Select Id Proof Type"
                        error={!!errors.idCardType}
                        hint={errors.idCardType?.message}
                      />
                    );
                  }}
                />
              </div>
              {/* ID Number */}
              <div>
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  type="text"
                  id="id_number"
                  {...register("id_number")}
                  error={!!errors.id_number}
                  hint={errors.id_number?.message}
                  placeholder="Enter ID number"
                />
              </div>
              {/* Qualification */}
              <div>
                <Label htmlFor="qualification">Last Qualification</Label>
                <Controller
                  name="qualification"
                  control={control}
                  render={({ field }) => {
                    const selectedOption =
                      qualificationOptions.find(
                        (o) => o.value === field.value
                      ) || null;
                    return (
                      <Select
                        options={qualificationOptions}
                        value={selectedOption}
                        onChange={(opt) => field.onChange(opt ? opt.value : "")}
                        placeholder="Last Qualification"
                        error={!!errors.qualification}
                        hint={errors.qualification?.message}
                      />
                    );
                  }}
                />
              </div>
              {/* Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  {...register("address")}
                  error={!!errors.address}
                  hint={errors.address?.message}
                  placeholder="Enter address"
                />
              </div>
              {/* Pincode */}
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  type="text"
                  id="pincode"
                  {...register("pincode")}
                  error={!!errors.pincode}
                  hint={errors.pincode?.message}
                  placeholder="Enter pincode"
                />
              </div>
              {/* State */}
              <div>
                <Label htmlFor="state">Select State</Label>
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: "State is required" }}
                  render={({ field }) => {
                    const selectedOption =
                      states.find((o) => o.value === field.value) || null;
                    return (
                      <Select
                        options={states}
                        value={selectedOption}
                        onChange={(opt) => {
                          // store the state's value (string) and clear city
                          field.onChange(opt ? opt.value : "");
                          setValue("city", "");
                        }}
                        placeholder="Select State"
                        error={!!errors.state}
                        hint={errors.state?.message}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <Label htmlFor="city">Select City</Label>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "City field is required" }}
                  render={({ field }) => {
                    const selectedOption =
                      cities.find((o) => o.value === field.value) || null;
                    return (
                      <Select
                        options={cities}
                        value={selectedOption}
                        onChange={(opt) => field.onChange(opt ? opt.value : "")}
                        placeholder={
                          selectedState
                            ? "Select City"
                            : "Please select state first"
                        }
                        isDisabled={!selectedState}
                        error={!!errors.city}
                        hint={errors.city?.message}
                      />
                    );
                  }}
                />
              </div>
              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  error={!!errors.email}
                  hint={errors.email?.message}
                  placeholder="Enter email"
                />
              </div>
              {/* Date of Birth */}
              <div>
                {/* <Label htmlFor="dob">Date of Birth</Label> */}
                {/* <Input
                  type="date"
                  id="dob"
                  {...register("dob")}
                  error={!!errors.dob}
                  hint={errors.dob?.message}
                  placeholder="Select date of birth"
                  max={new Date().toISOString().split("T")[0]} // disables future dates
                /> */}
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="date-picker"
                      label="Date of Birth"
                      placeholder="Select Date of Birth"
                      defaultDate={field.value || undefined}
                      onChange={(dates, dateStr) => {
                        // store date as string (YYYY-MM-DD)
                        field.onChange(dateStr);
                      }}
                    />
                  )}
                />
              </div>
              {/* Photo */}
              <div>
                <Label htmlFor="input">Upload Image</Label>
                {/* <DynamicFileUploader /> */}
                <Controller
                  name="file_url"
                  control={control}
                  render={({ field }) => (
                    <DynamicFileUploader
                      onFileSelect={(file) => setSelectedFile(file)} // ✅ Pass file to local state
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

            {/* Description */}

            {/* Course Details */}
            <ComponentCard title="Course Details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_code">Course Category</Label>
                  <Controller
                    name="course_code"
                    control={control}
                    render={({ field }) => {
                      const selectedOption = programs.find(
                        (p) => String(p.id) === String(field.value)
                      )
                        ? {
                            value: field.value,
                            label: programs.find(
                              (p) => String(p.id) === String(field.value)
                            ).program_name,
                          }
                        : null;
                      return (
                        <Select
                          options={programs.map((program) => ({
                            value: String(program.id),
                            label: program.program_name,
                            id: program.id,
                          }))}
                          value={selectedOption}
                          onChange={(opt) => {
                            // store program id as string in form
                            const programId = opt ? String(opt.value) : "";
                            field.onChange(programId);
                            // update filtered courses for selected program
                            const selectedProgram = programs.find(
                              (p) => String(p.id) === String(programId)
                            );
                            setFilteredCourses(selectedProgram?.courses || []);
                            // clear selected course name
                            setValue("course_name", "");
                          }}
                          placeholder={
                            programs.length
                              ? "Select Program"
                              : "Loading programs..."
                          }
                          error={!!errors.course_code}
                          hint={errors.course_code?.message}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="course_name">Course Name</Label>
                  <Controller
                    name="course_name"
                    control={control}
                    render={({ field }) => {
                      const selectedOption = filteredCourses.find(
                        (c) => String(c.id) === String(field.value)
                      )
                        ? {
                            value: field.value,
                            label: filteredCourses.find(
                              (c) => String(c.id) === String(field.value)
                            ).course_name,
                          }
                        : null;
                      return (
                        <Select
                          options={filteredCourses.map((course) => ({
                            value: String(course.id),
                            label: course.course_name,
                            id: course.id,
                          }))}
                          value={selectedOption}
                          onChange={(opt) =>
                            field.onChange(opt ? String(opt.value) : "")
                          }
                          placeholder={
                            filteredCourses.length
                              ? "Select Course"
                              : "Select a Program first"
                          }
                          isDisabled={!filteredCourses.length}
                          error={!!errors.course_name}
                          hint={errors.course_name?.message}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="net_fee">Net Fee</Label>
                  <Input
                    type="text"
                    id="net_fee"
                    {...register("net_fee")}
                    error={!!errors.net_fee}
                    hint={errors.net_fee?.message}
                    placeholder="Enter net fee"
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    type="text"
                    id="discount"
                    {...register("discount")}
                    error={!!errors.discount}
                    hint={errors.discount?.message}
                    placeholder="Enter discount"
                  />
                </div>
                <div>
                  <Label htmlFor="inquiry_source">Inquiry Source</Label>
                  <select
                    id="inquiry_source"
                    {...register("inquiry_source")}
                    className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400"
                  >
                    <option value="">Select Inquiry Source</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="Friend Referral">Friend Referral</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </ComponentCard>

            {/* Buttons */}
            <div className="w-full flex items-center justify-between gap-2 mt-4">
              <Button
                type="button"
                className="w-[10%] px-10"
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

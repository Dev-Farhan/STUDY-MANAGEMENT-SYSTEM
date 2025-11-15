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

// Validation schema
const schema = yup.object().shape({
  student_name: yup.string().required("Student name is required").min(3),
  father_name: yup.string().required("Father name is required"),
  mother_name: yup.string().required("Mother name is required"),
  gender: yup.string().required("Please select gender"),
  caste: yup.string().required("Please select caste"),
  maritalStatus: yup.string().required("Please select marital status"),
  mobile_number: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  parents_number: yup
    .string()
    .required("Parents contact is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  email: yup.string().email("Enter valid email"),
  dob_day: yup.string().required(),
  dob_month: yup.string().required(),
  dob_year: yup.string().required(),
  qualification: yup.string().required(),
  address: yup.string().required(),
  pincode: yup.string().required(),
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
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      // Combine DOB fields into a single date string
      formData.dob = `${formData.dob_year}-${formData.dob_month}-${formData.dob_day}`;
      delete formData.dob_day;
      delete formData.dob_month;
      delete formData.dob_year;

      // Handle photo upload
      if (formData.photo && formData.photo.length > 0) {
        const file = formData.photo[0];
        const { data, error } = await Supabase.storage
          .from("students")
          .upload(`photos/${file.name}`, file);

        if (error) {
          toast.error(error.message);
          return;
        }
        formData.photo_url = data.path;
      }

      // Insert into Supabase
      const { data, error } = await Supabase.from("student")
        .insert([formData])
        .select();
      if (error) {
        toast.error(error.message);
        return;
      }

      reset();
      toast.success("Student added successfully!");
      navigate("/student");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
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
                <select
                  id="gender"
                  {...register("gender")}
                  className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="flex gap-2">
                  <select
                    id="dob_day"
                    {...register("dob_day")}
                    className="h-11 w-1/3 rounded-lg border px-3 text-sm text-gray-400"
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    id="dob_month"
                    {...register("dob_month")}
                    className="h-11 w-1/3 rounded-lg border px-3 text-sm text-gray-400"
                  >
                    <option value="">Month</option>
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    id="dob_year"
                    {...register("dob_year")}
                    className="h-11 w-1/3 rounded-lg border px-3 text-sm text-gray-400"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 50 }, (_, i) => 2025 - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Caste */}
              <div>
                <Label htmlFor="caste">Caste</Label>
                <select
                  id="caste"
                  {...register("caste")}
                  className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400"
                >
                  <option value="">Select Caste</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <select
                  id="maritalStatus"
                  {...register("maritalStatus")}
                  className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
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
                <select
                  id="idCardType"
                  {...register("idCardType")}
                  className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400"
                >
                  <option value="">Select</option>
                  <option value="Adhar card">Adhar card</option>
                  <option value="Voter Id">Voter Id</option>
                  <option value="Other">Other</option>
                </select>
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
                <select
                  id="qualification"
                  {...register("qualification")}
                  className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400"
                >
                  <option value="">Select Qualification</option>
                  <option value="High School">10th</option>
                  <option value="Intermediate">12th</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
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

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="text"
                  id="email"
                  {...register("email")}
                  error={!!errors.email}
                  hint={errors.email?.message}
                  placeholder="Enter email"
                />
              </div>

              {/* Photo */}
              <div>
                <Label htmlFor="photo">Student Photo</Label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  {...register("photo")}
                  onChange={(e) => setValue("photo", e.target.files)}
                  className="h-11 w-full rounded-lg border px-3 text-sm text-gray-400 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white cursor-pointer"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      rows={6}
                      placeholder="Enter description"
                      error={!!errors.description}
                      hint={errors.description?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Course Details */}
            <ComponentCard title="Course Details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_code">Course Category</Label>
                  <Input
                    type="text"
                    id="course_code"
                    {...register("course_code")}
                    error={!!errors.course_code}
                    hint={errors.course_code?.message}
                    placeholder="Enter course category"
                  />
                </div>
                <div>
                  <Label htmlFor="course_name">Course Name</Label>
                  <Input
                    type="text"
                    id="course_name"
                    {...register("course_name")}
                    error={!!errors.course_name}
                    hint={errors.course_name?.message}
                    placeholder="Enter course name"
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

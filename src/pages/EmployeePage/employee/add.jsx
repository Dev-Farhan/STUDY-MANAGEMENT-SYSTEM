import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DatePicker from "../../../components/form/date-picker";
import DynamicFields from "../../../components/form/form-elements/DynamicFields";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { toast } from "react-toastify";
import supabase from "../../../config/supabaseClient";
import { useNavigate } from "react-router";

export default function EmployeeAdd() {
  let navigate = useNavigate();

  const schema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    mobile_number: yup
      .string()
      .matches(/^[0-9]+$/, "Mobile number must be numeric"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    gender: yup.string().required("Gender is required"),
    department: yup.string().required("Department is required"),
    date_of_joining: yup.string().required("Date of joining is required"),
  });
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

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

  const departmentOptions = [
    { value: "marketing", label: "Marketing" },
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "sales", label: "Sales" },
    { value: "hr", label: "Human Resources" },
  ];

  onsubmit = async (data) => {
    try {
      const response = await supabase.from("employees").insert(data);
      if (response.error) {
        throw response.error;
      }
      toast.success("Employee added successfully!");
      navigate("/employees");
      reset();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee. Please try again.");
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Employee Add" />
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              type="text"
              id="first_name"
              {...register("first_name")}
              error={!!errors.first_name}
              hint={errors.first_name?.message}
              placeholder="Enter first name"
            />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              type="text"
              id="last_name"
              {...register("last_name")}
              error={!!errors.last_name}
              hint={errors.last_name?.message}
              placeholder="Enter last name"
            />
          </div>

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

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => {
                const selectedOption =
                  genderOptions.find((o) => o.value === field.value) || null;
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

          <div>
            <Label htmlFor="department">Department</Label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => {
                const selectedOption =
                  departmentOptions.find((o) => o.value === field.value) ||
                  null;
                return (
                  <Select
                    options={departmentOptions}
                    value={selectedOption}
                    onChange={(opt) => field.onChange(opt ? opt.value : "")}
                    placeholder="Select Department"
                    error={!!errors.department}
                    hint={errors.department?.message}
                  />
                );
              }}
            />
          </div>

          <div>
            <Controller
              name="date_of_joining"
              control={control}
              render={({ field }) => (
                <DatePicker
                  id="date-picker"
                  label="Date of Joining"
                  placeholder="Select Date of Joining"
                  defaultDate={field.value || undefined}
                  onChange={(dates, dateStr) => {
                    // store date as string (YYYY-MM-DD)
                    field.onChange(dateStr);
                  }}
                />
              )}
            />
          </div>

          <div>
            <Label htmlFor="basic_salary">Basic Salary</Label>
            <Input
              type="text"
              id="basic_salary"
              {...register("basic_salary")}
              error={!!errors.basic_salary}
              hint={errors.basic_salary?.message}
              placeholder="Enter basic salary"
            />
          </div>

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
        </div>
        <div className="w-full flex items-center justify-between gap-2 mt-4">
          <Button
            type="button"
            className="w-[10%] px-10"
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
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}

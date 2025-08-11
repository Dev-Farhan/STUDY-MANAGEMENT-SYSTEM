import { useEffect, useState } from "react";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
// import DynamicFields from "../../../components/form/form-elements/DynamicFields";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Supabase from "@config/supabaseClient.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ComponentCard from "@components/common/ComponentCard.tsx";
import Button from "@components/ui/button/Button.tsx";
import Label from "@components/form/Label.tsx";
import Input from "@components/form/input/InputField";
import Select from "../../components/form/Select";
import axios from "axios";

const API_KEY = import.meta.env.VITE_STATE_CITY_API_KEY;

const schema = yup.object().shape({
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
    .nullable().test("city-required", "City is a required field", (value) => {
      return value && value.value;
    }),
});

export default function BranchAdd() {
  let navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
    console.log("Form Data:", formData);
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
      const { data, error } = await Supabase.from("courses")
        .insert([formData]) // use [formData] to insert as a row
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
  console.log("State error object:", errors.state);

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
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
            <div className="w-full  flex items-center justify-between gap-2 mt-4">
              <Button
                className="w-[10%] px-10 "
                size="sm"
                variant="outline"
                onClick={() => navigate(-1)}
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

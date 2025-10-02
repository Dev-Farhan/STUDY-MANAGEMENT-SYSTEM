import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker.tsx";
import TextArea from "../input/TextArea.tsx";
import Button from "../../ui/button/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import Supabase from "../../config/supabaseClient.ts";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
});

export default function DynamicFields({ fields, btntitle = "Add" }) {
  let navigate = useNavigate();

 const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const onSubmit = async (formData: any) => {
  //   try {
  //     const { email,password } = formData
  //     let { data, error } = await Supabase.auth.signInWithPassword({
  //       email, password
  //     })
  //     if (error) {
  //       toast.error(error?.message);
  //       console.error("Signin Error:", error.message);
  //       return;
  //     }
  //     reset();
  //     toast.success("User login succesfully");
  //     navigate("/");
  //   } catch (err: any) {
  //     toast.error(err?.message);
  //     }
  // };

  return (
    <ComponentCard title="Fill details">
        <form>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {fields.map((field, index) => (
          <div>
            {field.type === "text" && (
              <>
                <Label htmlFor="input">{field.label}</Label>
                <Input
                  type="text"
                  id="input"
                   {...register(`${field.label.toLowerCase()}`)}
                      error={!!errors.email}
                      hint={errors.email?.message}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </>
            )}
            {field.type === "email" && (
              <>
                <Label htmlFor="input">{field.label}</Label>
                <Input
                  type="email"
                  id="input"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </>
            )}
            {field.type === "phone" && (
              <>
                <Label htmlFor="input">{field.label}</Label>
                <Input
                  type="phone"
                  id="input"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </>
            )}
            {field.type === "select" && (
              <>
                <Label>Select Input</Label>
                <Select
                  options={field.options}
                  placeholder="Select an option"
                  //   onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </>
            )}
            {field.type === "date" && (
              <>
                <DatePicker
                  id="date-picker"
                  label="Date of joining"
                  placeholder="Select a date"
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </>
            )}
            {field.type === "textarea" && (
              <>
                <Label>{field.label}</Label>
                <TextArea
                  value={""}
                  onChange={(value) => {}}
                  rows={6}
               placeholder={` ${field.placeholder}`}
                />
              </>
            )}
          </div>
        ))}
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
          {btntitle}
        </Button>
      </div>
      </form>
    </ComponentCard>
  );
}

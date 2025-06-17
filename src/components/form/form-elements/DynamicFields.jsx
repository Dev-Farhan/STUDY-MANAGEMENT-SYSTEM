import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker.tsx";
import TextArea from "../input/TextArea.tsx";
import Button from "../../ui/button/Button";
import { useNavigate } from "react-router";
export default function DynamicFields({ fields, btntitle = "Add" }) {
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  return (
    <ComponentCard title="Fill employee details">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {fields.map((field, index) => (
          <div>
            {field.type === "text" && (
              <>
                <Label htmlFor="input">{field.label}</Label>
                <Input
                  type="text"
                  id="input"
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
                <Label>Address</Label>
                <TextArea
                  value={""}
                  onChange={(value) => {}}
                  rows={6}
                  placeholder="Enter address"
                />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="w-full  flex items-center justify-between gap-2 mt-4">
        <Button
          className="w-[10%] "
          size="sm"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button className="w-[10%]" size="sm">
          {btntitle}
        </Button>
      </div>
    </ComponentCard>
  );
}

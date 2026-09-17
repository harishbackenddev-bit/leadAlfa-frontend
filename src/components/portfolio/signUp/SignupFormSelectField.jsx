import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem } from "../../ui/form";
import { SelectField } from "../../../pages/brand/Campaigns/components/CampaignFormFields";

/**
 * react-hook-form + zod wiring for shared campaign-style SelectField (Radix).
 */
export function SignupFormSelectField({
  control,
  name,
  label,
  required,
  options,
  placeholder,
  inputClass,
  disabled = false,
  onChange: customOnChange,
}) {
  const formContext = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="w-full space-y-0">
          <FormControl>
            <SelectField
              name={name}
              label={label}
              required={required}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                if (val) {
                  formContext?.clearErrors?.(name);
                }
                if (typeof customOnChange === "function") {
                  customOnChange(val);
                }
              }}
              options={options}
              placeholder={placeholder}
              inputClass={inputClass}
              error={fieldState.error?.message}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

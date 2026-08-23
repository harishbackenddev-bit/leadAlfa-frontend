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
}) {
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
              onChange={field.onChange}
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

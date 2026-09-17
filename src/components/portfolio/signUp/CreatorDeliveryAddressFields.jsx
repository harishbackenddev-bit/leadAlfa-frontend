import { useEffect, useMemo, useRef } from "react";
import { creatorFormInputClass } from "../../../data/creatorSignupOptions";
import { creatorProvinces, creatorCitiesByProvince } from "../../../utils/location";
import { FieldLabel } from "../../../pages/brand/Campaigns/components/CampaignFormFields";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { SignupFormSelectField } from "./SignupFormSelectField";

function OptionalHint() {
  return <span className="font-normal text-gray-400"> (Optional)</span>;
}

export function CreatorDeliveryAddressFields({ form }) {
  const selectedProvince = form.watch("province");
  const currentCity = form.watch("city");
  const prevProvinceRef = useRef(selectedProvince);

  const cityOptions = useMemo(() => {
    if (!selectedProvince || !creatorCitiesByProvince[selectedProvince]) return [];
    const list = [...creatorCitiesByProvince[selectedProvince]];
    if (currentCity && !list.some((c) => c.value === currentCity)) {
      list.unshift({ label: currentCity, value: currentCity });
    }
    return list;
  }, [selectedProvince, currentCity]);

  useEffect(() => {
    if (prevProvinceRef.current !== selectedProvince) {
      prevProvinceRef.current = selectedProvince;
      if (selectedProvince) {
        const cities = creatorCitiesByProvince[selectedProvince] || [];
        if (currentCity && !cities.some((c) => c.value === currentCity)) {
          form.setValue("city", "", { shouldValidate: false });
          form.clearErrors("city");
        }
      }
    }
  }, [selectedProvince, currentCity, form]);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">          
          <h3 className="text-base font-semibold text-[#161C2B]">
            Address
          </h3>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          This address will be used for delivering campaign products and
          packages.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Address Line 1</FieldLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 24 Main Road"
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FieldLabel>
                Address Line 2
                <OptionalHint />
              </FieldLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Apartment 12, Building Name"
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SignupFormSelectField
          control={form.control}
          name="province"
          label="Province"
          required
          options={creatorProvinces}
          placeholder="Select Province"
          inputClass={creatorFormInputClass}
          onChange={() => {
            form.clearErrors("city");
          }}
        />
        <SignupFormSelectField
          control={form.control}
          name="city"
          label="City / Town"
          required
          disabled={!selectedProvince}
          options={cityOptions}
          placeholder={selectedProvince ? "Select City / Town" : "Select Province first"}
          inputClass={creatorFormInputClass}
        />
        <FormField
          control={form.control}
          name="suburb"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Suburb</FieldLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Sea Point"
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Postal Code</FieldLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 8005"
                  inputMode="numeric"
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="deliveryInstructions"
        render={({ field }) => (
          <FormItem>
            <FieldLabel>
              Delivery Instructions
              <OptionalHint />
            </FieldLabel>
            <FormControl>
              <Input
                placeholder="e.g. Leave with receptionist, Gate 2, Ring bell"
                className={creatorFormInputClass}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

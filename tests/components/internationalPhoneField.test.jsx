import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InternationalPhoneField } from "../../src/components/ui/phone-input";

describe("InternationalPhoneField", () => {
  it("locks the field to South Africa with no country dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <InternationalPhoneField
        value="+27"
        onChange={onChange}
        placeholder="Enter Phone Number"
      />
    );

    const countryButton = screen.getByRole("combobox", {
      name: /country selector/i,
    });
    expect(countryButton).toHaveAttribute("data-country", "za");
    expect(countryButton).toBeDisabled();
    expect(countryButton).toHaveClass(
      "react-international-phone-country-selector-button--hide-dropdown"
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter Phone Number");
    await user.type(input, "821234567");

    expect(onChange).toHaveBeenCalled();
    const lastValue = onChange.mock.calls.at(-1)?.[0];
    expect(lastValue).toBe("+27821234567");
  });
});

export const paymentsEnabled =
  String(import.meta.env.VITE_PAYFAST_ENABLED ?? "").toLowerCase() === "true";

export const redirectToPayFast = ({ url, fields }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
};

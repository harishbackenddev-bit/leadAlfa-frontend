import { MemoryRouter } from "react-router-dom";

export const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

export function TestMemoryRouter({ children, ...props }) {
  return (
    <MemoryRouter future={routerFutureFlags} {...props}>
      {children}
    </MemoryRouter>
  );
}

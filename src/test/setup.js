import '@testing-library/jest-dom/vitest';

window.scrollTo = () => {};
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

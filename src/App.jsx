import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../public/App.css";
import { Suspense } from "react";
import routes from "./routes";
import AuthRehydrator from "./components/AuthRehydrator";
import ScrollToTop from "./components/common/ScrollToTop";

// Loader component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Helper function to render routes recursively
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const { path, element: Element, children, index: isIndex } = route;

    if (children) {
      // Route with nested children
      return (
        <Route key={index} path={path} element={<Element />}>
          {renderRoutes(children)}
        </Route>
      );
    }

    // Regular route or index route
    if (isIndex) {
      return <Route key={index} index element={<Element />} />;
    }

    return <Route key={index} path={path} element={<Element />} />;
  });
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthRehydrator>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>{renderRoutes(routes)}</Routes>
        </Suspense>
      </AuthRehydrator>
    </Router>
  );
}

export default App;
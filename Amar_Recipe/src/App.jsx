import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Header from "./Components/Header";
import BrowseRecipe from "./Components/BrowseRecipe";
import Footer from "./Components/Footer";

// Pages
import SubmitRecipe from "./Pages/SubmitRecipe";
import About from "./Pages/About";
import VerifyEmail from "./Pages/VerifyEmail";

// Admin Panel
import AdminHeader from "./Components/AdminHeader";
import AdminPanel from "./Admin/AdminPanel";
import AdminFooter from "./Components/AdminFooter";
import SubmissionRequest from "./Admin/SubmissionRequest";
import HistoryDropdown from "./Admin/HistoryDropdown";
import AdminLogin from "./Admin/AdminLogin";
import AdminSignup from "./Admin/AdminSignup";
import AdminManagement from "./Admin/AdminManagement";
import AdminProfile from "./Admin/AdminProfile";
import Reports from "./Admin/Reports";
import SettingsPage from "./Admin/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <BrowseRecipe />
              <Footer />
            </>
          }
        />
        <Route
          path="/browse-recipes"
          element={
            <>
              <Header />
              <BrowseRecipe />
              <Footer />
            </>
          }
        />
        <Route
          path="/submit"
          element={
            <>
              <Header />
              <SubmitRecipe />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />
        <Route path="/adminpanel" element={
          <AdminPanel />
        } />
        <Route path="/submissionrequests" element={
          <>
            <AdminHeader />
            <SubmissionRequest />
            <AdminFooter />
          </>
        } />

        <Route path="/history" element={
          <>
            <AdminHeader />
            <HistoryDropdown />
            <AdminFooter />
          </>} />

        <Route path="/adminlogin" element={
          <AdminLogin />
        }
        />

        <Route path="/adminsignup" element={
          <AdminSignup />
        }
        />

        <Route path="/adminmanagement" element={
          <>
            <AdminHeader />
            <AdminManagement />
            <AdminFooter />
          </>} />

        <Route path="/adminprofile" element={
          <>
            <AdminHeader />
            <AdminProfile />
            <AdminFooter />
          </>} />

        <Route path="/settings" element={
          <>
            <AdminHeader />
            <SettingsPage />
            <AdminFooter />
          </>} />

        <Route path="/reports" element={
          <>
            <AdminHeader />
            <Reports />
            <AdminFooter />
          </>} />

        <Route path="/verify-email" element={<VerifyEmail />} />
          
        <Route path="/verify-email" element={<VerifyEmail />} />
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;


//npm install react-router-dom


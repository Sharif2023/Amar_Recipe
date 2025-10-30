import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import ChatModal from "../Admin/ChatModal";
import logo from "../assets/Amar_Recipe_Header_Logo.svg";

const AdminHeader = () => {
  const [reportCount, setReportCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [firstDropdownOpen, setFirstDropdownOpen] = useState(false);
  const [secondDropdownOpen, setSecondDropdownOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [profileImage, setProfileImage] = useState(
    "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  const firstDropdownRef = useRef(null);
  const secondDropdownRef = useRef(null);
  const BASE_URL = "http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/";

  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")));

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const BASE_URL = "http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/";

    if (adminData) {
      setAdmin(adminData);

      if (adminData.profileImage) {
        const fullPath = adminData.profileImage.startsWith("http")
          ? adminData.profileImage
          : BASE_URL + adminData.profileImage;

        setProfileImage(fullPath);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [reportRes, submissionRes] = await Promise.all([
          fetch('http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/get_report_count.php'),
          fetch('http://localhost/Amar_Recipies_jsx/Amar_Recipe/src/api/get_submission_count.php')
        ]);

        const reportJson = await reportRes.json();
        const submissionJson = await submissionRes.json();

        if (reportJson.success) setReportCount(reportJson.count);
        if (submissionJson.success) setSubmissionCount(submissionJson.count);

      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/adminlogin");
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const onReportClick = () => {
    setReportCount(0);
    navigate('/reports');
  };

  const onSubmissionClick = () => {
    setSubmissionCount(0);
    navigate('/submissionrequests');
  };

  // Close dropdowns if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        firstDropdownRef.current &&
        !firstDropdownRef.current.contains(event.target)
      ) {
        setFirstDropdownOpen(false);
      }
      if (
        secondDropdownRef.current &&
        !secondDropdownRef.current.contains(event.target)
      ) {
        setSecondDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      {/* Navbar */}
      <nav className="relative flex w-full items-center bg-[#1f1f1f] py-2 px-4 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4">
        <div className="flex w-full flex-wrap items-center justify-between">
          {/* Hamburger button for mobile */}
          <button
            type="button"
            className="block border-0 bg-transparent p-2 text-neutral-400 hover:text-orange-600 focus:outline-none lg:hidden"
            aria-controls="navbarSupportedContent1"
            aria-expanded={!navCollapsed}
            aria-label="Toggle navigation"
            onClick={() => setNavCollapsed(!navCollapsed)}
          >
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center text-white font-bold text-2xl mb-4 lg:mb-0 cursor-pointer gap-2">
            <img
              src={logo}
              className="w-8 h-8"
              alt="Amar Recipe Header Logo"
            />
            আমার রেসিপি <small> (Admin Panel) </small>
          </div>

          {/* Nav links + search (collapsible on mobile) */}
          <div
            className={`w-full lg:flex lg:w-auto lg:items-center ${navCollapsed ? "hidden" : "block"
              }`}
            id="navbarSupportedContent1"
          >
            <ul className="flex flex-col lg:flex-row list-none gap-4 lg:gap-6 mb-4 lg:mb-0 lg:mr-6 text-neutral-400">
              <li>
                <NavLink
                  to="/adminpanel"
                  className={({ isActive }) =>
                    isActive ? 'text-orange-600 px-2 py-2 flex-shrink-0' : 'text-white px-2 py-2 flex-shrink-0'
                  }
                >
                  ড্যাশবোর্ড
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/submissionrequests"
                  className={({ isActive }) =>
                    isActive ? 'text-orange-600 px-2 py-2 flex-shrink-0' : 'text-white px-2 py-2 flex-shrink-0'
                  }
                >
                  সাবমিশন রিকুয়েষ্ট
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/reports'}
                  className={({ isActive }) =>
                    isActive ? 'text-orange-600 px-2 py-2 flex-shrink-0' : 'text-white px-2 py-2 flex-shrink-0'
                  }
                >
                  রিপোর্ট
                </NavLink>
              </li>

              <li>
                <NavLink
                  to='/adminmanagement'
                  className={({ isActive }) =>
                    isActive ? 'text-orange-600 px-2 py-2 flex-shrink-0' : 'text-white px-2 py-2 flex-shrink-0'
                  }
                >
                  অ্যাডমিন ম্যানেজমেন্ট
                </NavLink>
              </li>
            </ul>

            {/* Search bar */}
            <div className="mb-4 lg:mb-0 lg:ml-0 lg:mr-6 flex justify-center">
              <input
                type="text"
                placeholder="Search..."
                className="w-full max-w-md rounded-md border border-gray-600 bg-[#2a2a2a] px-3 py-1.5 text-sm text-neutral-300 placeholder:text-neutral-500 focus:border-orange-600 focus:outline-none"
              />

            </div>
          </div>

          {/* Chat elements */}
          <div className="flex items-center space-x-4">
            {/* Chat Icon */}
            <a
              href="#"
              className="text-neutral-400 hover:text-orange-600 transition"
              aria-label="Cart"
              onClick={toggleChat}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </a>
            <ChatModal isOpen={isChatOpen} onClose={toggleChat} senderId={admin.id} />

            <div className="relative" ref={firstDropdownRef}>
              <button
                onClick={() => {
                  setFirstDropdownOpen((prev) => !prev);
                }}
                className="flex items-center text-neutral-400 hover:text-orange-600 transition relative"
                aria-expanded={firstDropdownOpen}
                aria-haspopup="true"
                aria-controls="dropdownMenuNotifications"
                aria-label="Notifications"
              >
                {/* Bell Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                    clipRule="evenodd"
                  />
                </svg>

                {/* Red dot if any count is > 0 */}
                {(reportCount > 0 || submissionCount > 0) && (
                  <span className="absolute -mt-4 ml-2 rounded-full bg-red-600 px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">
                    {reportCount + submissionCount}
                  </span>
                )}
              </button>

              {/*Notification Dropdown Menu */}
              {firstDropdownOpen && (
                <ul
                  id="dropdownMenuNotifications"
                  className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-[#1f1f1f] py-1 shadow-lg shadow-black/80"
                  role="menu"
                >
                  <li>
                    <button
                      onClick={onReportClick}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-orange-600"
                    >
                      রিপোর্ট দেখুন ({reportCount})
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={onSubmissionClick}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-orange-600"
                    >
                      সাবমিশন রিকুয়েষ্ট ({submissionCount})
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={secondDropdownRef}>
              <button
                onClick={() => setSecondDropdownOpen((prev) => !prev)} //updated
                className="flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none text-neutral-400 hover:text-orange-600"
                aria-expanded={secondDropdownOpen}
                aria-haspopup="true"
                aria-controls="dropdownMenu2"
                aria-label="User menu"
              >
                <img
                  src={profileImage}
                  alt="Admin Profile"
                  className="h-8 w-8 rounded-full border-2 border-rose-600 shadow-md"
                />
              </button>
              {secondDropdownOpen && (
                <ul
                  id="dropdownMenu2"
                  className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg bg-[#1f1f1f] py-1 shadow-lg shadow-black/80"
                  role="menu"
                >
                  <li className="pt-2 pb-2">
                    <div className="px-2 text-sm text-white">{admin.name}</div>
                    <div className="px-2 text-sm text-neutral-400"><small>{admin.email}</small></div>
                  </li><hr className="text-neutral-500" />
                  <li>
                    <Link
                      to='/adminprofile'
                      className="flex items-center px-2 py-2 text-sm text-neutral-300 hover:bg-gray-700"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      প্রোফাইল
                    </Link>
                  </li>
                  <li>

                    <Link
                      to="/history"
                      className="flex px-2 items-center py-2 text-sm text-neutral-300 hover:bg-gray-700"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                      </svg>

                      ইতিহাস
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/settings"
                      className="flex px-2 items-center py-2 text-sm text-neutral-300 hover:bg-gray-700"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      সেটিংস এবং প্রাইভেসি
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex px-4 items-center justify-center py-2 text-sm bg-[#ff3300] text-neutral-300 hover:bg-orange-600 w-full"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                      </svg>
                      লগ আউট
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;

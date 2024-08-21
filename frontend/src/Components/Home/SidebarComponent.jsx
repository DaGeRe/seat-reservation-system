import React, { useState, useEffect } from "react";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { BsList } from "react-icons/bs";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { RiAdminFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock, FaCog, FaBookmark, FaEye, FaEyeSlash } from "react-icons/fa";
import ChangePassword from "./ChangePassword";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { CiLogout } from "react-icons/ci";
import { MdGTranslate } from "react-icons/md";
import { toast } from 'react-toastify';

const SidebarComponent = () => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [activeTab, setActiveTab] = useState("calendar");
  const location = useLocation();
  const navigate = useNavigate();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [visibility, setVisibility] = useState(localStorage.getItem("visibility"));

  useEffect(() => {
    // Extract the current pathname from the location
    const path = location.pathname;
    // Determine the active tab based on the current pathname
    if (path.startsWith("/admin")) {
      setActiveTab("admin");
    } else if (path.startsWith("/mybookings")) {
      setActiveTab("bookings");
    } else {
      setActiveTab("calendar");
    }
  }, [location.pathname]);

  const handleClick = (name) => {
    switch (name) {
      case "collapse":
        setCollapsed(!collapsed);
        localStorage.setItem("sidebarCollapsed", !collapsed);
        break;

      case "calendar":
        setActiveTab("calendar");
        navigate("/home", { replace: true });
        break;

      case "admin":
        setActiveTab("admin");
        navigate("/admin", { replace: true });
        break;

      case "bookings":
        setActiveTab("bookings");
        navigate("/mybookings", { replace: true });
        break;

      case "language":
        const currentLanguage = i18n.language;
        const newLanguage = currentLanguage === "en" ? "de" : "en";
        i18n.changeLanguage(newLanguage);
        break;

      case "changePassword":
        setIsChangePasswordModalOpen(true);
        break;

      case "logout":
        setIsLogoutConfirmationOpen(true);
        break;

      case "visibility":
        changeVisibility();
        break;

      default:
        break;
    }
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleCloseLogoutConfirmationModal = () => {
    setIsLogoutConfirmationOpen(false);
  };

  const handleChangePasswordSubmit = (event) => {
    event.preventDefault();
    setIsChangePasswordModalOpen(false);
  };
  
  const handleLogoutConfirmed = () => {
    localStorage.removeItem("userId"); // Clear the user's session
    navigate("/", { replace: true }); // Redirect to login page
  };

  const changeVisibility = async () => {
    try {
      const response = await fetch(`/users/visibility/${localStorage.getItem("userId")}`, {
        method: "PUT"
      });
      const data = await response.json();
      if (response.ok && data !== -1) {
        if (data === 1) {
          setVisibility("true");
          localStorage.setItem("visibility", "true");
          toast.success(t("visible"));
        } else {
          setVisibility("false");
          localStorage.setItem("visibility", "false");
          toast.success(t("anonymousMessage"));
        }
      } else {
        toast.warning(t("failVisibility"));
      }
    } catch (error) {
        console.log("Error changing visibility");
    }  
  }

  return (
    <div>
      <Sidebar
        collapsed={collapsed}
        backgroundColor="#008444"
        width={collapsed ? "80px" : "210px"}
        style={{
          height: "100vh",
          [`&.active`]: {
            backgroundColor: "#13395e",
            color: "#b6c8d9",
            overflow: "auto",
          },
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              if (level === 0)
                return {
                  backgroundColor: active ? "#ffdd00" : undefined,
                };
            },
          }}
        >
          <MenuItem
            active={activeTab === "collapse"}
            icon={<BsList />}
            onClick={() => handleClick("collapse")}
          >
            {localStorage.getItem("name") ? `${t("hello")}, ${localStorage.getItem("name")}` : `${t("hello")}!`}
          </MenuItem>
          {localStorage.getItem("admin") === "true" && (
            <MenuItem
              active={activeTab === "admin"}
              icon={<RiAdminFill />}
              onClick={() => handleClick("admin")}
            >
              {t("admin")}
            </MenuItem>
          )}
          <MenuItem
            active={activeTab === "calendar"}
            icon={<IoCalendarNumberOutline />}
            onClick={() => handleClick("calendar")}
          >
            {t("calendar")}
          </MenuItem>
          <MenuItem
            active={activeTab === "bookings"}
            icon={<FaBookmark />}
            onClick={() => handleClick("bookings")}
          >
            {t("bookings")}
          </MenuItem>
          <MenuItem
            icon={<MdGTranslate />}
            onClick={() => handleClick("language")}
          >
            {i18n.language === "en" ? "Deutsch" : "English"}
          </MenuItem>
        </Menu>
        <Menu>
          <SubMenu icon={<FaCog />} label={t("settings")}>
            <MenuItem icon={visibility === "true" ? <FaEye /> : <FaEyeSlash />} onClick={() => handleClick("visibility")}>{t("visibility")}</MenuItem>
            <MenuItem icon={<FaLock />} onClick={() => handleClick("changePassword")}>{t("password")}</MenuItem>
            <MenuItem icon={<CiLogout />} onClick={() => handleClick("logout")}>{t("logout")}</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>

      {/* Change Password Modal */}
      <ChangePassword
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
        onSubmit={handleChangePasswordSubmit}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutConfirmationOpen}
        onClose={handleCloseLogoutConfirmationModal}
        onConfirm={handleLogoutConfirmed}
      />
    </div>
  );
};

export default SidebarComponent;

import React, { useState, useEffect } from "react";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { BsList } from "react-icons/bs";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { RiAdminFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLock, FaBookmark } from "react-icons/fa";
import ChangePassword from "./ChangePassword";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { CiLogout } from 'react-icons/ci';
import { MdGTranslate } from 'react-icons/md';
import FreeDesks from './FreeDesks/FreeDesks';
import { AiFillPlusCircle } from 'react-icons/ai';
import { IoIosCheckbox } from 'react-icons/io';
import { IoIosAlbums } from 'react-icons/io';

const SidebarComponent = () => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [activeTab, setActiveTab] = useState("calendar");
  const location = useLocation();
  const navigate = useNavigate();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isFreeDesksModalOpen, setIsFreeDesksModalOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  //const [visibility, setVisibility] = useState(localStorage.getItem("visibility"));

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

      case 'freeDesks':
        setIsFreeDesksModalOpen(true);
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

/*       case "visibility":
        changeVisibility();
        break; */

      default:
        break;
    }
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleCloseFreeDesksModal = () => {
    setIsFreeDesksModalOpen(false);
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

  /*const changeVisibility = async () => {
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
    putRequest(
      `/users/visibility/${localStorage.getItem("userId")}`,
      headers,
      (data) => {
        if (data === -1) {
          toast.warning(t("failVisibility"));
        }
        if (data === 1) {
          setVisibility("true");
          localStorage.setItem("visibility", "true");
          toast.success(t("visible"));
        }
        else {
          setVisibility("false");
          localStorage.setItem("visibility", "false");
          toast.success(t("anonymousMessage"));
        }
      },
      () => {console.log(`Failed to put visibility for userId: ${localStorage.getItem("userId")}.`);}
    );
  }*/

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
            id='sidebar_collapse'
            active={activeTab === "collapse"}
            icon={<BsList />}
            onClick={() => handleClick("collapse")}
          >
            {localStorage.getItem("name") ? `${t("hello")}, ${localStorage.getItem("name")}` : `${t("hello")}!`}
          </MenuItem>
          {localStorage.getItem("admin") === 'true' && (
            <MenuItem
              id='sidebar_admin'
              active={activeTab === "admin"}
              icon={<RiAdminFill />}
              onClick={() => handleClick("admin")}
            >
              {t("admin")}
            </MenuItem>
          )}
          <MenuItem
            id='sidebar_calendar'
            active={activeTab === "calendar"}
            icon={<IoCalendarNumberOutline />}
            onClick={() => handleClick("calendar")}
          >
            {t("calendar")}
          </MenuItem>
          <MenuItem
            id='sidebar_bookings'
            active={activeTab === "bookings"}
            icon={<FaBookmark />}
            onClick={() => handleClick("bookings")}
          >

            {t("bookings")}
          </MenuItem>

          <Menu>
            <SubMenu icon={<IoIosAlbums />} label={t('series')}>
              <MenuItem id='sidebar_manageseries' icon={<IoIosCheckbox />} onClick={() => {
                 navigate("/manageseries", { replace: true });
              }}>{t('manage')}</MenuItem>
              <MenuItem id='sidebar_createseries' icon={<AiFillPlusCircle />} onClick={() => {
                 navigate("/createseries", { replace: true });
              }}>{t('create')}</MenuItem>
            </SubMenu> 
          </Menu>

          {/*<MenuItem
              icon = {<TbDeviceDesktopSearch />}
              onClick={() => handleClick('freeDesks')}
          >
            {t('freeDesks')}
          </MenuItem>*/}

          <MenuItem
            id='sidebar_language'
            icon={<MdGTranslate />}
            onClick={() => handleClick("language")}
          >
            {i18n.language === "en" ? "Deutsch" : "English"}
          </MenuItem>

        </Menu>
        <Menu>
          <MenuItem id='sidebar_changePassword' icon={<FaLock />} onClick={() => handleClick('changePassword')}>{t('password')}</MenuItem>
          <MenuItem id='sidebar_logout' icon={<CiLogout />} onClick={() => handleClick('logout')}>{t('logout')}</MenuItem>
        </Menu>
      </Sidebar>

      {/* Change Password Modal */}
      <ChangePassword
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
        onSubmit={handleChangePasswordSubmit}
      />

      <FreeDesks
        isOpen={isFreeDesksModalOpen}
        onClose={handleCloseFreeDesksModal}
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

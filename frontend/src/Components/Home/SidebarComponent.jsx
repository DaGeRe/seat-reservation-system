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
import { AiFillPlusCircle } from 'react-icons/ai';
import { IoIosCheckbox } from 'react-icons/io';
import { IoIosAlbums } from 'react-icons/io';
import LaptopIcon from '@mui/icons-material/Laptop';

const SidebarComponent = () => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [seriesSubMenuOpen, setSeriesSubMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');//useState('calendar');
  const location = useLocation();
  const navigate = useNavigate();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  
  /*useEffect(()=>{
    console.log('activeTab', activeTab)
  }, [activeTab]);*/
  useEffect(() => {
    console.log(seriesSubMenuOpen);
    if (location.pathname === '/admin') {
      setActiveTab('admin');
      setSeriesSubMenuOpen(false);
    }
    if (location.pathname === '/home') {
      setActiveTab('calendar');
      setSeriesSubMenuOpen(false);
    }
    if (location.pathname === '/mybookings') {
      setActiveTab('bookings');
      setSeriesSubMenuOpen(false);
      
    }
    if (location.pathname === '/manageseries' || location.pathname === '/createseries') {
      setActiveTab('series');
      setSeriesSubMenuOpen(true);
    }
    if (location.pathname === '/freeDesks') {
      setActiveTab('freeDesks');
      setSeriesSubMenuOpen(false);
    }

  }, [location.pathname, activeTab]);

  const handleClick = (name) => {
    switch (name) {
      case "collapse":
        setCollapsed(!collapsed);
        localStorage.setItem("sidebarCollapsed", !collapsed);
        break;

      case 'calendar':
        navigate("/home", { replace: true });
        break;

      case "admin":
        navigate("/admin", { replace: true });
        break;

      case "bookings":
        navigate('/mybookings', { replace: true });
        break;

      case 'freeDesks':
        navigate("/freeDesks", { replace: true });
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
            active={activeTab === 'bookings'}
            icon={<FaBookmark />}
            onClick={() => handleClick('bookings')}
          >

            {t('bookings')}
          </MenuItem>

          {/*<MenuItem
            id='sidebar_freeDesks'
            active={activeTab === 'freeDesks'}
            icon={<LaptopIcon />}
            onClick={() => handleClick('freeDesks')}
          >
            {t('freeDesks')}
          </MenuItem>*/}

 
            <SubMenu active={activeTab === 'series'} icon={<IoIosAlbums />} label={t('series')}>
              <MenuItem id='sidebar_manageseries' icon={<IoIosCheckbox />} onClick={() => {navigate('/manageseries', { replace: true });}}>
                {t('manage')}
              </MenuItem>
              <MenuItem id='sidebar_createseries' icon={<AiFillPlusCircle />} onClick={() => {navigate('/createseries', { replace: true });}}>
                {t('create')}
              </MenuItem>
            </SubMenu> 
 

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

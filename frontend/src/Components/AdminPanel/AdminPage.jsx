import React, { useState, useEffect } from "react";
import SidebarComponent from "../Home/SidebarComponent";
import { FaAddressBook, FaPlusMinus } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import "./AdminPage.css"; // Import the CSS file for AdminPage
import styled from '@emotion/styled';
import AddRoom from './Room/AddRoom';
import DeleteRoom from './Room/DeleteRoom';
import EditRoom from './Room/EditRoom';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import AddWorkstation from './Workstation/AddWorkstation';
import EditWorkstation from './Workstation/EditWorkstation';
import DeleteWorkstation from './Workstation/DeleteWorkstation';
import AddEmployee from './UserManagement/AddEmployee';
import DeleteEmployee from './UserManagement/DeleteEmployee';
import EditEmployee from './UserManagement/EditEmployee';
import DeleteBookings from './Bookings/DeleteBookings';
import EditBookings from './Bookings/EditBookings';
import { ColumnGraph } from "./ColumnGraph";
import { HeatMap } from "./HeatMap";
import { UsageGraph } from "./UsageGraph";
import noDataImage from "../Assets/nodb.png";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const { t } = useTranslation();
  const [graph, setGraph] = useState("column-map");
  const [floor, setFloor] = useState("ground");
  const [activeTab, setTab] = useState("general");
  const [deskList, setDeskList] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const floorFilter = (currentFloor) => {
    // const currentFloor = "Ground";
    if (currentFloor === "Ground") {
      setFloor("ground");
    }
    if (currentFloor === "First") {
      setFloor("first");
    }
    const options = {
      method: "GET", // or "POST", "PUT", etc.
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      }
  };
    fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms`, options)
      .then((response) => response.json())
      .then((data) => {
        // Filter rooms based on the current floor
        const filteredRooms = data.filter(
          (room) => room.floor === currentFloor
        );
        setDeskList(filteredRooms);
        setTab("statistics");
        console.log(filteredRooms);
        // setRooms(filteredRooms);
      })
      .catch((error) => {
        console.error("Error fetching room data:", error);
      });
  };

  const randomiseData = () => {
    setRefresh(!refresh);
  };
  const [showEmployeeButtons, setShowEmployeeButtons] = useState(false);
  const [showWorkstationButtons, setShowWorkstationButtons] = useState(false);
  const [showBookingButtons, setShowBookingButtons] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isAddWorkstationOpen, setIsAddWorkstationOpen] = useState(false);
  const [isEditWorkstationOpen, setIsEditWorkstationOpen] = useState(false);
  const [isDeleteWorkstationOpen, setIsDeleteWorkstationOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isDeleteEmployeeOpen, setIsDeleteEmployeeOpen] = useState(false);

  const [isEditBookingsOpen, setIsEditBookingsOpen] = useState(false);
  const [isDeleteBookingsOpen, setIsDeleteBookingsOpen] = useState(false);
  const toggleEmployeeButtons = () => {
    setShowEmployeeButtons(!showEmployeeButtons);
    if (showEmployeeButtons === false) {
      setShowWorkstationButtons(false);
      setShowBookingButtons(false);
    }
  };

  const toggleWorkstationButtons = () => {
    setShowWorkstationButtons(!showWorkstationButtons);
    if (showWorkstationButtons === false) {
      setShowEmployeeButtons(false);
      setShowBookingButtons(false);
    }
  };

  const toggleBookingButtons = () => {
    setShowBookingButtons(!showBookingButtons);
    if (showBookingButtons === false) {
      setShowEmployeeButtons(false);
      setShowWorkstationButtons(false);
    }
  };
  
  const toggleAddRoomModal = () => setIsAddRoomOpen(!isAddRoomOpen);
  const toggleDeleteRoomModal = () => setIsDeleteRoomOpen(!isDeleteRoomOpen);
  const toggleEditRoomModal = () => setIsEditRoomOpen(!isEditRoomOpen);
  const toggleAddWorkstationModal = () => setIsAddWorkstationOpen(!isAddWorkstationOpen);
  const toggleEditWorkstationModal = () => setIsEditWorkstationOpen(!isEditWorkstationOpen);
  const toggleDeleteWorkstationModal = () => setIsDeleteWorkstationOpen(!isDeleteWorkstationOpen);
  const toggleAddEmployeeModal = () => setIsAddEmployeeOpen(!isAddEmployeeOpen);
  const toggleEditEmployeeModal = () => setIsEditEmployeeOpen(!isEditEmployeeOpen);
  const toggleDeleteEmployeeModal = () => setIsDeleteEmployeeOpen(!isDeleteEmployeeOpen);
  const toggleEditBookingsModal = () => setIsEditBookingsOpen(!isEditBookingsOpen);
  const toggleDeleteBookingsModal = () => setIsDeleteBookingsOpen(!isDeleteBookingsOpen);

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      minWidth: '800px !important',
      height: 'auto'
    },
  }));

  const BootstrapWorkstationDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      minWidth: '500px !important',
      height: 'auto'
    },
  }));

  const BootstrapEmployeeDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      minWidth: '1000px !important',
      height: 'auto'
    },
  }));

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ alignItems: "center", justifyContent: "center", alignContent: "space-between" }} {...other}>
        {children}
        {onClose ? (
          <IconButton aria-label="close" onClick={onClose}></IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  return (
    <div className="adminhome-page">
      <SidebarComponent />
      <div className="adminpage-content">
        <div className="maps">
          <div
            onClick={() => setTab("general")}
            className={activeTab === "general" ? "column-map" : "map"}
          >
            {t("general")}
          </div>
{/*           <div
            onClick={() => floorFilter("Ground")}
            className={activeTab === "statistics" ? "heat-map" : "map"}
          >
            {t("statistics")}
          </div> */}
        </div>
        {activeTab === "general" ? (
          <div className="admin-content">
            <h1>{t("adminPanel")}</h1>
            <div className="admin-controls-container">
              <div className="user-management-container">
                <button className="user-management-button" onClick={toggleEmployeeButtons}>
                  {t("userManagement")}
                </button>
                <FaAddressBook className="logo" />
              </div>
              <div className="edit-rooms-container">
                <button className="edit-rooms-button" onClick={toggleWorkstationButtons}>
                {t("roomManagement")}
                </button>
                <FaPlusMinus className="logo" />
              </div>
              <div className="manage-bookings-container">
                <button className="manage-bookings-button" onClick={toggleBookingButtons}>
                {t("bookingManagement")}
                </button>
                <FaBook className="logo" />
              </div>
            </div>
            <div className={`employee-button-wrapper ${showEmployeeButtons ? 'visible' : ''}`}>
              <button className="employee-button" onClick={toggleAddEmployeeModal}>
                {t("addEmployee")}
              </button>
              <button className="employee-button" onClick={toggleDeleteEmployeeModal}>
                {t("deleteEmployee")}
              </button>
              <button className="employee-button" onClick={toggleEditEmployeeModal}>
                {t("editEmployee")}
              </button>
            </div>
            <div className={`workstation-button-wrapper ${showWorkstationButtons ? 'visible' : ''}`}>
              <button className="workstation-button" onClick={toggleAddRoomModal}>
                {t("addRoom")}
              </button>
              <button className="workstation-button" onClick={toggleDeleteRoomModal}>
                {t("deleteRoom")}
              </button>
              <button className="workstation-button" onClick={toggleEditRoomModal}>
                {t("editRoom")}
              </button>
              <button className="workstation-button" onClick={toggleAddWorkstationModal}>
                {t("addWorkstation")}
              </button>
              <button className="workstation-button" onClick={toggleDeleteWorkstationModal}>
                {t("deleteWorkstation")}
              </button>
              <button className="workstation-button" onClick={toggleEditWorkstationModal}>
                {t("editWorkstation")}
              </button>
            </div>
            <div className={`booking-button-wrapper ${showBookingButtons ? 'visible' : ''}`}>
              <button className="booking-button" onClick={toggleDeleteBookingsModal}>
                {t("deleteBooking")}
              </button>
            {/*   <button className="booking-button" onClick={toggleEditBookingsModal}>
                {t("editBooking")}
              </button> */}
            </div>
          </div>
        ) : (
          <div className="bottom-container">
            <div className="desk-list">
              {deskList === "" ? (
                <div className="desk-component">
                  <div className="desk-description-no-data">
                    <p className="item-name">{t("deskNotFound")}</p>
                  </div>
                </div>
              ) : (
                deskList.map((desk, index) => (
                  <div
                    onClick={() => randomiseData()}
                    className="desk-component"
                    key={index}
                  >
                    <div>{desk.id}.</div>
                    <div className="desk-description">
                      <p className="item-name">
                        {desk.floor === "Ground" ? t("groundFloor") : t("firstFloor")}</p>
                      <p className="item-taken">{t("available")}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="data-display">
              <div className="maps">
                <div
                  onClick={() => floorFilter("Ground")}
                  className={floor === "ground" ? "column-map" : "map"}
                >
                  {t("groundFloor")}
                </div>
                <div
                  onClick={() => floorFilter("First")}
                  className={floor === "first" ? "heat-map" : "map"}
                >
                {t("firstFloor")}
                </div>
              </div>
              <div className="maps">
                <div
                  onClick={() => setGraph("column-map")}
                  className={graph === "column-map" ? "column-map" : "map"}
                >
                  Column Map
                </div>
                <div
                  onClick={() => setGraph("heat-map")}
                  className={graph === "heat-map" ? "heat-map" : "map"}
                >
                  Heat Map
                </div>
                <div
                  onClick={() => setGraph("usage-map")}
                  className={graph === "usage-map" ? "usage-map" : "map"}
                >
                  {t("usage")}
                </div>
              </div>
              {deskList === "" ? (
                <div className="no-map-content">
                  <img src={noDataImage} alt="" style={{ height: "100%" }} />
                </div>
              ) : (
                <>
                  {graph === "heat-map" ? (
                    <div className="map-content">
                      <HeatMap />
                    </div>
                  ) : (
                    ""
                  )}
                  {graph === "column-map" ? (
                    <div className="map-content">
                      <ColumnGraph value={refresh} />
                    </div>
                  ) : (
                    ""
                  )}
                  {graph === "usage-map" ? (
                    <div className="map-content">
                      <UsageGraph />
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <BootstrapDialog onClose={toggleAddRoomModal} aria-labelledby="customized-dialog-title" open={isAddRoomOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("addRoom").toUpperCase()}
        </BootstrapDialogTitle>
        <AddRoom addRoomModal={toggleAddRoomModal} />
      </BootstrapDialog>

      <BootstrapDialog onClose={toggleDeleteRoomModal} aria-labelledby="customized-dialog-title" open={isDeleteRoomOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("deleteRoom").toUpperCase()}
        </BootstrapDialogTitle>
        <DeleteRoom deleteRoomModal={toggleDeleteRoomModal} />
      </BootstrapDialog>

      <BootstrapDialog onClose={toggleEditRoomModal} aria-labelledby="customized-dialog-title" open={isEditRoomOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("editRoom").toUpperCase()}
        </BootstrapDialogTitle>
        <EditRoom editRoomModal={toggleEditRoomModal} />
      </BootstrapDialog>

      <BootstrapWorkstationDialog onClose={toggleAddWorkstationModal} aria-labelledby="customized-dialog-title" open={isAddWorkstationOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("addWorkstation").toUpperCase()}
        </BootstrapDialogTitle>
        <AddWorkstation addWorkstationModal={toggleAddWorkstationModal} />
      </BootstrapWorkstationDialog>

      <BootstrapWorkstationDialog onClose={toggleEditWorkstationModal} aria-labelledby="customized-dialog-title" open={isEditWorkstationOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("editWorkstation").toUpperCase()}
        </BootstrapDialogTitle>
        <EditWorkstation editWorkstationModal={toggleEditWorkstationModal} />
      </BootstrapWorkstationDialog>

      <BootstrapWorkstationDialog onClose={toggleDeleteWorkstationModal} aria-labelledby="customized-dialog-title" open={isDeleteWorkstationOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("deleteWorkstation").toUpperCase()}
        </BootstrapDialogTitle>
        <DeleteWorkstation deleteWorkstationModal={toggleDeleteWorkstationModal} />
      </BootstrapWorkstationDialog>


      <BootstrapWorkstationDialog onClose={toggleAddEmployeeModal} aria-labelledby="customized-dialog-title" open={isAddEmployeeOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("addEmployee").toUpperCase()}
        </BootstrapDialogTitle>
        <AddEmployee addEmployeeModal={toggleAddEmployeeModal} />
      </BootstrapWorkstationDialog>

      <BootstrapEmployeeDialog onClose={toggleEditEmployeeModal} aria-labelledby="customized-dialog-title" open={isEditEmployeeOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("editEmployee").toUpperCase()}
        </BootstrapDialogTitle>
        <EditEmployee editEmployeeModal={toggleEditEmployeeModal} />
      </BootstrapEmployeeDialog>

      <BootstrapEmployeeDialog onClose={toggleDeleteEmployeeModal} aria-labelledby="customized-dialog-title" open={isDeleteEmployeeOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("deleteEmployee").toUpperCase()}
        </BootstrapDialogTitle>
        <DeleteEmployee deleteEmployeeModal={toggleDeleteEmployeeModal} />
      </BootstrapEmployeeDialog>

      <BootstrapEmployeeDialog onClose={toggleEditBookingsModal} aria-labelledby="customized-dialog-title" open={isEditBookingsOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("editBooking").toUpperCase()}
        </BootstrapDialogTitle>
        <EditBookings editBookingsModal={toggleEditBookingsModal} />
      </BootstrapEmployeeDialog>

      <BootstrapEmployeeDialog onClose={toggleDeleteBookingsModal} aria-labelledby="customized-dialog-title" open={isDeleteBookingsOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("deleteBooking").toUpperCase()}
        </BootstrapDialogTitle>
        <DeleteBookings deleteBookingsModal={toggleDeleteBookingsModal} />
      </BootstrapEmployeeDialog>
    </div>
  );
};

export default AdminPage;

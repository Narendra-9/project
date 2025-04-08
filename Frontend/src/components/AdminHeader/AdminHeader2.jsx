import React, { useState } from "react";
import AdminSideNavBar from "../AdminSideNavBar/AdminSideNavBar";
import "./AdminHeader2.css";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as NotificationIcon } from "../../assets/notification.svg";
import Logo from "../Logo/Logo";
import IconButton from "@mui/material/IconButton";
import { Badge, styled } from "@mui/material";
import { ToastContainer } from "react-toastify";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 1,
    padding: "0 4px",
    backgroundColor: "rgb(255, 86, 64)",
  },
}));

function AdminHeader2() {
  let [openMenu, setOpenMenu] = useState(false);

  function toggleOpenMenu() {
    setOpenMenu(!openMenu);
  }

  function closeMenu() {
    setOpenMenu(false);
  }

  return (
    <div className="admin-header-new">
      <ToastContainer />
      <header className="admin-header">
        <div className="logo-section-container">
          <MenuIcon className="menu-icon" onClick={toggleOpenMenu} />
          <Logo />
        </div>
        <div className="admin-details-container">
          <div className="badges">
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={1} color="secondary">
                <NotificationIcon className="notification-icon" />
              </StyledBadge>
            </IconButton>
          </div>
        </div>
      </header>
      <AdminSideNavBar openMenu={openMenu} closeMenu={closeMenu} />
      {openMenu && (
        <div className="admin-menu-overlay" onClick={toggleOpenMenu}></div>
      )}
    </div>
  );
}

export default AdminHeader2;

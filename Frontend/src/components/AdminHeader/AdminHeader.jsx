import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';
import {NavLink} from "react-router-dom";

function AdminHeader() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="admin-navbar p-3">
        <Container>
          <Navbar.Brand href="#home" className="">
            <span
              style={{ fontWeight: "700", fontSize: "25px", color: "white",fontFamily:"DavaSans" }}
            >
              endava strength
            </span>{" "}
            <img
              src="https://companieslogo.com/img/orig/DAVA-d4ea9241.png?t=1632326300&download=true"
              height="30px"
              alt="logo"
            ></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto custom-nav">
            <NavLink to="/admin/home" className="nav-link">Home</NavLink>
            <NavLink to="/admin/add-category" className="nav-link">Mange Categories</NavLink>
            <NavLink to="/admin/add-product" className="nav-link">Manage Products</NavLink>
            <NavLink to="/admin/manage-orders" className="nav-link">Manage Orders</NavLink>
            <NavLink to="/admin/manage-users" className="nav-link">Manage Users</NavLink>
            {/* <NavDropdown title="Manage Category" id="collapsible-nav-dropdown">
              <NavDropdown.Item ><NavLink to="/admin/add-category" className="nav-link dropdown-link">Add Catgeory</NavLink></NavDropdown.Item>
              <NavDropdown.Item ><NavLink to="/admin/add-category" className="nav-link dropdown-link">Delete Catgeory</NavLink></NavDropdown.Item>
              <NavDropdown.Item ><NavLink to="/admin/edit-category" className="nav-link dropdown-link">Edit Catgeory</NavLink></NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Manage Product" id="collapsible-nav-dropdown">
              <NavDropdown.Item ><NavLink to="/admin/add-product"  className="nav-link dropdown-link">Add Product</NavLink></NavDropdown.Item>
              <NavDropdown.Item ><NavLink to="/admin/edit-product" className="nav-link dropdown-link">Edit Product</NavLink></NavDropdown.Item>
              <NavDropdown.Item ><NavLink to="/admin/delete-product" className="nav-link dropdown-link">Delete Product</NavLink></NavDropdown.Item>
            </NavDropdown>
              <NavLink to="/admin/manage-orders" className="nav-link">Manage Orders</NavLink>
              <NavLink to="/admin/manage-users" className="nav-link">Manage users</NavLink> */}
              <NavDropdown title={<svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-person-circle"
                      viewBox="0 0 16 16"
                      style={{ color: "white" }}
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                      />
                    </svg>} id="collapsible-nav-dropdown" 
                    align="end">
              <NavDropdown.Item ><NavLink to="/admin/myprofile"  className="nav-link dropdown-link">My Profile</NavLink></NavDropdown.Item>
              <NavDropdown.Item ><NavLink to="/logout" className="nav-link dropdown-link">Logout</NavLink></NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminHeader;

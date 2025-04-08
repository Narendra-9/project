import React, { useContext, useEffect, useState } from "react";
import AddAddressPopUp from "../AddAddressPopUp/AddAddressPopUp";
import { UserConext } from "../../context/UserContext";
import "./UserAddresses.css";
import axios from "axios";
import HeadingWithBullet from "../HeadingWithBullet/HeadingWithBullet";
import { ThemeContext } from "../../context/ThemeContext";
import Swal from "sweetalert2";

function UserAddresses() {
  const { user } = useContext(UserConext);
  let [userAddresses, setUserAddresses] = useState([]);
  let [addAddress, setAddAddress] = useState(false);
  let [editAddress, setEditAddress] = useState(false);
  let [addressToBeEdited, setAddressToBeEdited] = useState(null);
  const { isPremium } = useContext(ThemeContext);

  useEffect(() => {
    async function getUserAddresses() {
      let response = await axios.get(
        `http://localhost:8080/user-address/${user?.userId}`
      );
      setUserAddresses(response.data.body);
    }
    if (user) {
      getUserAddresses();
    }
  }, [user]);

  function openAddAddressSection() {
    setAddAddress(true);
  }

  function openEditAddressSection(addres) {
    setAddressToBeEdited(addres);
    setEditAddress(true);
  }

  function addInAddressState(addedAddress) {
    if (addedAddress.isDefault) {
      setUserAddresses((prev) => {
        const updatedAddresses = prev.map((i) =>
          i.isDefault ? { ...i, isDefault: false } : i
        );
        return updatedAddresses;
      });
    }
    setUserAddresses((prev) => [...prev, addedAddress]);
  }

  function editInAddressState(editedAddress) {
    if (editedAddress.isDefault) {
      setUserAddresses((prev) => {
        const updatedAddresses = prev.map((i) =>
          i.isDefault ? { ...i, isDefault: false } : i
        );
        return updatedAddresses;
      });
    }

    setUserAddresses((prevUserAddress) =>
      prevUserAddress.map((address) =>
        address.userAddressId === editedAddress.userAddressId
          ? { ...address, ...editedAddress }
          : address
      )
    );
  }

  function closeAddAddressPopUp() {
    setAddAddress(false);
    setEditAddress(false);
    setAddressToBeEdited(null);
  }

  async function handleDelete(userAddressId) {
    const result = await Swal.fire({
      html: `
                            <div class='swal-div-content'>
                                <p class="sweet-alert-cart-del-msg">Are you sure you want to delete this Address ?</p>
                            </div>
                            `,
      showDenyButton: true,
      denyButtonText: "Cancel",
      confirmButtonText: "Delete",
      customClass: {
        popup: "custom-popup",
        confirmButton: "custom-confirm-button",
        denyButton: "custom-deny-button",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/user-address/delete/${userAddressId}`
        );
        let filteredAddresses = userAddresses.filter(
          (address) => address?.userAddressId !== userAddressId
        );
        setUserAddresses([...filteredAddresses]);
      } catch (e) {
        await Swal.fire({
          html: `
                                                        <div class='swal-div-content'>
                                                        </div>
                                                    `,
          icon: "success",
          customClass: {
            popup: "custom-popup",
            confirmButton: "custom-confirm-button",
          },
          confirmButtonText: "OK",
        });
      }
    }
  }
  return (
    <div className="user-address-container pt-5">
      <HeadingWithBullet heading={"My Addresses"} />
      <div className="address-cards mt-4">
        {userAddresses?.map((address) => {
          return (
            <div
              key={address.userAddressId}
              className={
                isPremium ? "address-card address-card-premium" : "address-card"
              }
            >
              <div className="address-card-name">
                <p className="address-card-full-name" style={{ margin: 0 }}>
                  {address.fullName.slice(0, 25)}
                  {address.fullName.length > 25 && "..."}
                </p>
                {address.isDefault && <span>(Default)</span>}
              </div>
              <div className="address-card-address">
                {address.mobileNo}, {address.address},{" "}
                {address.city.toUpperCase()}, {address.state.toUpperCase()},{" "}
                {address.pincode.toUpperCase()}
              </div>
              <div className="address-card-btns mt-2 mb-4">
                <button
                  className="addres-card-edit-btn"
                  onClick={() => openEditAddressSection(address)}
                >
                  Edit
                </button>
                <button
                  className="address-card-remove-btn"
                  onClick={() => handleDelete(address.userAddressId)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        <div className="dummy-card" onClick={openAddAddressSection}>
          <span style={{ fontSize: "30px" }}>+</span>
        </div>
      </div>
      {addAddress && (
        <AddAddressPopUp
          closeAddAddressPop={closeAddAddressPopUp}
          addInAddressState={addInAddressState}
        />
      )}
      {editAddress && (
        <AddAddressPopUp
          closeAddAddressPop={closeAddAddressPopUp}
          addressToBeEdited={addressToBeEdited}
          editInAddressState={editInAddressState}
        />
      )}
    </div>
  );
}

export default UserAddresses;

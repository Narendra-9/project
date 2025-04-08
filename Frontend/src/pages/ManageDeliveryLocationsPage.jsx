import React, { useEffect, useState } from "react";
import "../css/ManageDeliveryLocationsPage.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import InputErrorMessage from "../components/InputErrorMessage/InputErrorMessage";
import { LABELS } from "../config/labels";
import HeadingWithBullet from "../components/HeadingWithBullet/HeadingWithBullet";
import Swal from "sweetalert2";
import showToast from "../components/CustomToast/CustomToast";

function ManageDeliveryLocationsPage() {
  // * DeliveryLocations
  const [deliveryLocations, setDeliveryLocations] = useState([]);

  // * DeliveryLocation Input
  const [deliveryLocationDto, setDeliveryLocationDto] = useState({
    deliveryLocation: "",
    expectedDeliveryDays: "",
  });

  // * State for validation errors
  const [errors, setErrors] = useState({});

  // ! Function to get All Delivery Locations.
  const getAllDeliveryLocations = async () => {
    axios
      .get(process.env.REACT_APP_DELIVERY_LOCATION_SERVICE)
      .then((response) => setDeliveryLocations(response.data.body));
  };

  // ! Getting all Locations once the component mounts.
  useEffect(() => {
    getAllDeliveryLocations();
  }, []);

  // ! Validating inputs before submission
  function validateInputs() {
    let errors = {};
    if (!deliveryLocationDto.deliveryLocation.trim()) {
      errors.deliveryLocation = "Delivery location is required.";
    }
    if (!deliveryLocationDto.expectedDeliveryDays) {
      errors.expectedDeliveryDays = "Expected delivery days are required.";
    } else if (deliveryLocationDto.expectedDeliveryDays <= 0) {
      errors.expectedDeliveryDays = "Delivery days must be greater than 0.";
    } else if (deliveryLocationDto.expectedDeliveryDays > 15) {
      errors.expectedDeliveryDays = "Delivery days must be between 1 and 15";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  //  ! Function to addLocation
  async function handleAddLocation() {
    // returns if not valid
    if (!validateInputs()) {
      return;
    }

    // Trimming the values before submitting
    const cleanedDeliveryLocationDto = {
      deliveryLocation: deliveryLocationDto.deliveryLocation.trim(),
      expectedDeliveryDays: deliveryLocationDto.expectedDeliveryDays
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_DELIVERY_LOCATION_SERVICE,
        JSON.stringify(cleanedDeliveryLocationDto),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      //  Instead of making an another fetch call setting the response dynamically.
      setDeliveryLocations([...deliveryLocations, response.data.body]);

      // Setting back to empty once added.
      setDeliveryLocationDto({
        deliveryLocation: "",
        expectedDeliveryDays: "",
      });
    } catch (e) {
      if (e.status === 409) {
        // If my custom status arises.
        showToast("Delivery Location Already Exists", "error");
      } else {
        toast.error(LABELS.defaultErrorMessage);
      }
      console.error("Error Adding Location ", e);
    }
  }

  // ! Function to deleteDeliveryLocations
  const handleDeleteLocation = async (id) => {
    const result = await Swal.fire({
      html: `
                        <div class='swal-div-content'>
                            <p class="sweet-alert-cart-del-msg">Are you sure you want to delete this Location ?</p>
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
          `${process.env.REACT_APP_DELIVERY_LOCATION_SERVICE}/delete/${id}`
        );
        // Instead of refetching the deliveryLocations again , I am modifying the state.
        setDeliveryLocations(
          deliveryLocations.filter(
            (deliveryLocation) => deliveryLocation.deliveryLocationId !== id
          )
        );
        console.log(LABELS.deliveryLocationDeleted)
        showToast(LABELS.deliveryLocationDeleted, "success");
      } catch (e) {
        toast.error(LABELS.defaultErrorMessage);
        console.error("Error Deleting Delivery Location ", e);
      }
    }
  };

  // ! Function to store Inputs.
  function handleInputChange(e) {
    const { name, value } = e.target;

    if (name === "deliveryLocation") {
      //  Allowing only alphabets and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setDeliveryLocationDto({ ...deliveryLocationDto, [name]: value });
        setErrors({ ...errors, deliveryLocation: "" });
      }
    } else if (name === "expectedDeliveryDays") {
      //  Blocking e, +, _ from being entered
      if (!/[eE+\-_]/.test(value)) {
        setDeliveryLocationDto({ ...deliveryLocationDto, [name]: value });
        setErrors({ ...errors, expectedDeliveryDays: "" });
      }
    }
  }

  return (
    <div className="manage-delivery-locations-container">
      <HeadingWithBullet heading={"Manage Delivery Locations"} />
      <div className="row mt-3">
        <div className="col-lg-4 mb-3">
          <Form.Control
            type="text"
            placeholder="Delivery Location"
            name="deliveryLocation"
            className="location-page-input"
            onChange={handleInputChange}
            minLength={3}
            maxLength={30}
            value={deliveryLocationDto.deliveryLocation}
          />
          {errors.deliveryLocation && (
            <InputErrorMessage errorMessage={errors.deliveryLocation} />
          )}
        </div>

        <div className="col-lg-4 mb-3">
          <Form.Control
            type="number"
            placeholder="Expected Delivery"
            name="expectedDeliveryDays"
            className="location-page-input number-input"
            onChange={handleInputChange}
            value={deliveryLocationDto.expectedDeliveryDays}
            min={1}
            max={15}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "_"].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {errors.expectedDeliveryDays && (
            <InputErrorMessage errorMessage={errors.expectedDeliveryDays} />
          )}
        </div>

        <div className="col-lg-4 mb-2">
          <button className="location-add-btn" onClick={handleAddLocation}>
            Add
          </button>
        </div>
      </div>

      <div
        className="manage-delivery-locations-table-div mt-4"
        style={{ width: "80%" }}
      >
        {/* Delivery Locations Table */}
        <table className="manage-delivery-locations-table">
          <thead>
            <tr>
              <th>Delivery Location</th>
              <th>Expected Delivery Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryLocations.map((deliveryLocation) => {
              return (
                <tr key={deliveryLocation.deliveryLocationId}>
                  <td>{deliveryLocation?.deliveryLocation}</td>
                  <td>{deliveryLocation?.expectedDeliveryDays}</td>
                  <td>
                    <DeleteIcon
                      className="location-delete-icon"
                      onClick={() =>
                        handleDeleteLocation(
                          deliveryLocation.deliveryLocationId
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageDeliveryLocationsPage;

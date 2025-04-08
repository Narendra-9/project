import React, { useEffect, useState } from "react";
import "../css/ManageBannerPage.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
// import {ReactComponent as EditIcon} from "../assets/edit.svg"
import { ReactComponent as DeleteIcon } from "../assets/trash.svg";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import { Link } from "react-router-dom";
import HeadingWithBullet from "../components/HeadingWithBullet/HeadingWithBullet";
import showToast from "../components/CustomToast/CustomToast";
import { LABELS } from "../config/labels";
import Swal from "sweetalert2";
import InputErrorMessage from "../components/InputErrorMessage/InputErrorMessage";
import { Tooltip } from "@mui/material";

function ManageBannerPage() {
  // * Banners state
  const [banners, setBanners] = useState(null);

  // * Banner's Input State
  const [bannerInput, setBannerInput] = useState({
    bannerImgUrl: "",
    validity: "",
    takeToUrl: "",
  });

  // * Banner Input PopUp
  const [openBannerInputs, setOpenBannerInputs] = useState(false);

  // * State to store errors
  const [errors, setErrors] = useState({});

  const [editingBannerId, setEditingBannerId] = useState(null);

  // ! Function to close Banner Input PopUp
  function closeBannerInputs() {
    setOpenBannerInputs(false);
    setEditingBannerId(null);
    setErrors({});
    setBannerInput({ bannerImgUrl: "", validity: "", takeToUrl: "" });
  }

  // ! Function to Open Banner Input PopUp
  function openBannerInputContainer() {
    setOpenBannerInputs(true);
  }

  // ! Sending the existing inputs for updating
  function openEditBanner(banner) {
    setBannerInput(banner);
    setEditingBannerId(banner.bannerId);
    setOpenBannerInputs(true);
  }

  // ! Function to get All Banners.
  const getAllBanners = async () => {
    let response = await axios.get("http://localhost:8080/display-banner");
    setBanners(response.data.body);
  };

  // ! Getting All banners once component mounts.
  useEffect(() => {
    getAllBanners();
  }, []);

  // ! Function to handle Banner Inputs.
  function handleInputChange(e) {
    setBannerInput({ ...bannerInput, [e.target.name]: e.target.value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  }

  // ! Function to validate Inputs
  function validateInputs() {
    let newErrors = {};
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    const imageRegex =
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|tiff|ico))$/i;
    const today = new Date().toISOString().split("T")[0];

    // BannerImg URL is required and should be valid.
    if (!bannerInput.bannerImgUrl.trim()) {
      newErrors.bannerImgUrl = "Banner Image URL is required.";
    } else if (!imageRegex.test(bannerInput.bannerImgUrl)) {
      newErrors.bannerImgUrl = "Enter a valid URL.";
    }
    if(bannerInput.bannerImgUrl.length>150){
      newErrors.bannerImgUrl = "Img URL must be less than 150 characters.";
    }

    // validity date required and should be greater than today.
    if (!bannerInput.validity) {
      newErrors.validity = "Validity date is required.";
    } else if (bannerInput.validity <= today) {
      newErrors.validity = "Select a future date.";
    }

    // Take to Url is there and not valid.
    if (bannerInput.takeToUrl && !urlPattern.test(bannerInput.takeToUrl)) {
      newErrors.takeToUrl = "Enter a valid URL.";
    }
    if(bannerInput.takeToUrl.length>150){
      newErrors.takeToUrl = "URL must be less than 150 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ! Function to add Banner.
  async function addBanner() {
    // If Errors , returning back
    if (!validateInputs()) {
      return;
    }

    try {
      if (editingBannerId) {
        // Updating the existing Banner
        await axios.put(
          `${process.env.REACT_APP_DISPLAY_BANNER_SERVICE}/edit-banner`,
          JSON.stringify(bannerInput),
          {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        // updating the state dynamically rather fetching again.
        setBanners((prevBanners) =>
          prevBanners.map((banner) =>
            banner.bannerId === editingBannerId
              ? { ...banner, ...bannerInput }
              : banner
          )
        );
        showToast(LABELS.displayBannerEdited, "success");
      } else {
        // Adding a new banner
        let response = await axios.post(
          `${process.env.REACT_APP_DISPLAY_BANNER_SERVICE}/add-banner`,
          JSON.stringify(bannerInput),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        // Setting the Banners from the response instead of fetching them again.
        setBanners([...banners, response.data.body]);

        showToast(LABELS.displayBannerAdded, "success");
      }
    } catch (e) {
      // If Custom Status occurs then showing respective message.
      if (e.status === 409) {
        showToast(LABELS.bannerExists, "error");
      } else {
        showToast(LABELS.defaultErrorMessage, "info");
        console.error("Error Adding Banner ", e);
      }
    } finally {
      // Closing Banner Inputs
      closeBannerInputs();
    }
  }

  // ! Function to delete Banner.
  async function deleteBanner(id) {
    const result = await Swal.fire({
      html: `
                            <div class='swal-div-content'>
                                <p class="sweet-alert-cart-del-msg">Are you sure you want to delete this Banner ?</p>
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
          `${process.env.REACT_APP_DISPLAY_BANNER_SERVICE}/delete-banner/${id}`
        );

        // Instead of fetching them again , filtering the banners in the state dynamically.
        let filteredBanners = banners.filter((b) => b.bannerId !== id);
        setBanners(filteredBanners);

        showToast(LABELS.displayBannerDeleted, "success");
      } catch (e) {
        showToast(LABELS.defaultErrorMessage, "info");
        console.error("Error Deleting the Banner ", e);
      }
    }
  }

  return (
    <div className="manage-banner-container container">
      <HeadingWithBullet heading={"Manage Display Banners"} />

      {/* Conditional Rendering the display banner inputs. */}
      {openBannerInputs && (
        <>
          <div className="banner-input-overlay"></div>
          <div className="manage-display-banner-inputs">
            <div className="banner-input-close-div">
              <CloseIcon
                className="banner-input-close-icon"
                onClick={closeBannerInputs}
              />
            </div>

            <div className="row">
              <div className="col">
                <Form.Control
                  type="text"
                  name="bannerImgUrl"
                  value={bannerInput.bannerImgUrl}
                  maxLength={150}
                  placeholder="Enter Banner Image URL"
                  onChange={handleInputChange}
                  className="manage-product-input-field number-input"
                />
                {errors.bannerImgUrl && (
                  <InputErrorMessage errorMessage={errors.bannerImgUrl} />
                )}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <Form.Control
                  type="date"
                  name="validity"
                  min={new Date().toISOString().split("T")[0]}
                  value={bannerInput.validity}
                  placeholder="Enter Validity"
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.preventDefault()}
                  className="manage-product-input-field number-input"
                />
                {errors.validity && (
                  <InputErrorMessage errorMessage={errors.validity} />
                )}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col">
                <Form.Control
                  type="text"
                  name="takeToUrl"
                  maxLength={150}
                  value={bannerInput.takeToUrl}
                  placeholder="Enter respective Link"
                  onChange={handleInputChange}
                  className="manage-product-input-field number-input"
                />
                {errors.takeToUrl && (
                  <InputErrorMessage errorMessage={errors.takeToUrl} />
                )}
              </div>
            </div>

            <div className="row mt-4">
              <div className="col d-flex justify-content-end">
                <button className="banner-save-btn" onClick={addBanner}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="row">
        <div className="col d-flex justify-content-end">
          <div className="mproduct-add-btn-div">
            <Tooltip title="Add banner" placement="top">
              <button
                className="mproduct-add-btn"
                onClick={openBannerInputContainer}
              >
                +
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="table-responsive mt-2">
        <table className="banner-images-table">
          <thead>
            <tr>
              <th>Banner Id.</th>
              <th>Banner Img</th>
              <th>Banner Validity</th>
              <th>Banner TakeToUrl</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners?.map((banner) => {
              return (
                <tr key={banner.displayBannerId}>
                  <td>{banner.bannerId}</td>
                  <td>
                    <img
                      src={banner.bannerImgUrl}
                      alt="banner-img"
                      className="img-fluid"
                      style={{ maxWidth: "300px", height: "auto" }}
                    ></img>
                  </td>
                  <td>{banner.validity}</td>
                  <td style={{ maxWidth: "400px" }}>
                    <Link
                      className="banner-page-link"
                      style={{ color: "#5899C4" }}
                      to={banner.takeToUrl}
                    >
                      {banner.takeToUrl}
                    </Link>
                  </td>
                  <td>
                    {/* <EditIcon className="display-page-edit-icon"/>  */}
                    <DeleteIcon
                      className="display-page-delete-icon"
                      onClick={() => deleteBanner(banner.bannerId)}
                    />
                    <button onClick={() => openEditBanner(banner)}>Edit</button>
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

export default ManageBannerPage;

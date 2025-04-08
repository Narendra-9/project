import axios from "axios";
import React, { useEffect, useState } from "react";
import { LABELS } from "../../config/labels";
import showToast from "../CustomToast/CustomToast";
import InputErrorMessage from "../InputErrorMessage/InputErrorMessage";

function EditProductPopUp({
  product,
  closeEditPopUpContainer,
  updateProducts,
}) {
  // * State to hold EditInputs
  const [editedProduct, setEditedProduct] = useState({
    productId: "",
    basePrice: "",
    discountedPrice: "",
    stockQuantity: "",
  });

  // * Setting the editable content in the state when the component mounts.
  useEffect(() => {
    if (product) {
      setEditedProduct({
        productId: product?.productId,
        basePrice: product?.basePrice || "",
        discountedPrice: product?.discountedPrice || "",
        stockQuantity: product?.stockQuantity || "",
      });
    }
  }, [product]);

  // ! Function to handle input Change.
  function handleChange(event) {
    const { name, value } = event.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clearing errors when the user starts typing again
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }

  // * State for validation errors
  const [errors, setErrors] = useState({});

  // ! Function to validate inputs
  function validateInputs() {
    let newErrors = {};

    const basePrice = editedProduct.basePrice;
    const discountedPrice = editedProduct.discountedPrice;
    const stockQuantity = editedProduct.stockQuantity;

    if (basePrice <= 0 || basePrice > 20000) {
      newErrors.basePrice = "Base Price must be between 1 and 20000.";
    }

    if (discountedPrice <= 0) {
      newErrors.discountedPrice ="Must be a number greater than 0.";
    } else if (discountedPrice >= basePrice) {
      newErrors.discountedPrice ="Must be less than Base Price.";
    }

    if (stockQuantity < 0) {
      newErrors.stockQuantity ="Stock Quantity must be a non-negative integer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ! Function to update the Change.
  async function handleSave() {
    if (!validateInputs()) {
      return;
    }

    try {
      let response = await axios.put(
        process.env.REACT_APP_EDIT_PRODUCT,
        editedProduct,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Instead of fetching all the products again, changing the particular product in state.
      updateProducts(response.data.body);
    } catch (err) {
      showToast(LABELS.defaultErrorMessage, "error");
    } finally {
      closeEditPopUpContainer();
    }
  }

  return (
    <div className="edit-product-popup">
      <div className="edit-product-popup-img">
        <img
          className="edit-product-img"
          src={product?.listOfImages[0]?.url}
          height="150px"
          alt="product-img"
        ></img>
      </div>

      <div className="edit-popup-product-name-div">
        <p className="edit-popup-product-name-div">{product?.productName}</p>
      </div>

      <div className="edit-product-popup-input mb-2">
        <label className="edit-product-popup-input-label">Base Price</label>
        <input
          placeholder="Enter Base Price"
          onChange={handleChange}
          value={editedProduct.basePrice}
          name="basePrice"
          className="edit-product-popup-input-text number-input"
          type="number"
          min={1}
          max={200000}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "_"].includes(e.key)) {
              e.preventDefault();
            }
          }}
        ></input>
        {errors.basePrice && <InputErrorMessage errorMessage={errors.basePrice}/>}
      </div>

      <div className="edit-product-popup-input mb-2">
        <label className="edit-product-popup-input-label">
          Discounted Price
        </label>
        <input
          placeholder="Enter Discounted Price"
          onChange={handleChange}
          value={editedProduct.discountedPrice}
          name="discountedPrice"
          className="edit-product-popup-input-text number-input"
          type="number"
          min={1}
          max={200000}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "_"].includes(e.key)) {
              e.preventDefault();
            }
          }}
        ></input>
        {errors.discountedPrice && <InputErrorMessage errorMessage={errors.discountedPrice}/>}
      </div>

      <div className="edit-product-popup-input mb-2">
        <label className="edit-product-popup-input-label">Stock Quantity</label>
        <input
          placeholder="Enter Stock Quantity"
          onChange={handleChange}
          value={editedProduct.stockQuantity}
          name="stockQuantity"
          className="edit-product-popup-input-text number-input"
          type="number"
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "_"].includes(e.key)) {
              e.preventDefault();
            }
          }}
        ></input>
        {errors.stockQuantity && <InputErrorMessage errorMessage={errors.stockQuantity}/>}
      </div>

      <div className="edit-product-popup-save mt-3">
        <button
          className="edit-product-popup-cancel-btn"
          onClick={closeEditPopUpContainer}
        >
          Cancel
        </button>
        <button className="edit-product-popup-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default EditProductPopUp;

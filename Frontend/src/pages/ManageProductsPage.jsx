import React, { useEffect, useState } from "react";
import "../css/ManageProductsPage.css";
import DataTable from "react-data-table-component";
import HeadingWithBullet from "../components/HeadingWithBullet/HeadingWithBullet";
import { useNavigate } from "react-router-dom";
import EditProductPopUp from "../components/EditProductPop/EditProductPopUp";
import axios from "axios";
import toast from "react-hot-toast";
import MyCustomLoader from "../components/MyCustomLoader/MyCustomLoader";
import showToast from "../components/CustomToast/CustomToast";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#30404B",
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  rows: {
    style: {
      backgroundColor: "#37424B",
      fontSize: "14px",
      color: "white",
    },
  },
  cells: {
    style: {
      justifyContent: "justify",
      // textAlign:"center",
      padding: "10px",
    },
  },
  pagination: {
    style: {
      backgroundColor: "#5E6A73", // Light grey background
      borderTop: "1px solid #ddd",
      padding: "10px",
      color: "white",
    },
    pageButtonsStyle: {
      color: "#FF5640", // Bootstrap primary blue
      fill: "#FF5640", // Changes arrow colors
      fontSize: "14px",
      borderRadius: "50px",
    },
  },
};

const getStockColor = (stockQuantity) => {
  if (stockQuantity === 0) return "red";
  if (stockQuantity <= 10) return "orange";
  return "white";
};

function ManageProductsPage() {
  let [products, setProducts] = useState([]);

  let [loading, setLoading] = useState(true);
  const [toggleActionLoading,setToggleActionLoading]=useState(false);

  let [openEditPopUp, setOpenEditPopUp] = useState(false);
  let [currentProduct, setCurrentProduct] = useState(null);

  let navigate = useNavigate();

  async function getAllProducts() {
    try {
      let response = await axios.get(process.env.REACT_APP_GET_ALL_PRODUCTS);
      setProducts(response.data.body);
    } catch (err) {
      toast.error("Error fetching Products");
      console.error("Error Fetching Products ", err);
    } finally {
      setLoading(false);
    }
  }

  function updateProducts(product) {
    setProducts((prev) => [
      ...prev.filter((i) => i.productId !== product.productId),
      product,
    ]);
  }

  const toggleProductActive = async (productId) => {
    try{
      setToggleActionLoading(true);

      setProducts((prev) =>
        prev.map((product) =>
          product.productId === productId
            ? { ...product, active: !product.active }
            : product
        )
      );
      
      await axios.put(
        `http://localhost:8080/products/${productId}/toggleActive`,
        {},
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      const updatedProduct = products.find((product) => product.productId === productId);
      showToast(!updatedProduct.active ? "Product Activated" : "Product Deactivated");
    }
    catch(error){
      showToast("Something Went Wrong","error");
      console.error("Error Toggling Product's State ", error);

      // If error occurred, I am reverting back the made changes.
      setProducts((prevUsers) =>
        prevUsers.map((product) =>
          product.productId === productId ? { ...product, active: !product.active } : product
        )
      );
    }
    finally{
      setToggleActionLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  function openEditPopUpContainer(row) {
    setCurrentProduct(row);
    setOpenEditPopUp(true);
  }

  function closeEditPopUpContainer() {
    setOpenEditPopUp(false);
    setCurrentProduct(null);
  }

  const columns = [
    {
      name: "P Id",
      selector: (row) => row.productId,
      width: "100px",
      center: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      wrap: true,
      width: "250px",
    },
    {
      name: "Base Price",
      selector: (row) => row.basePrice,
      // maxWidth:"100px",
      center: true,
    },
    {
      name: "Discounted Price",
      selector: (row) => row.discountedPrice,
      center: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.stockQuantity,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            color: getStockColor(row.stockQuantity),
            fontWeight: "bold",
          }}
        >
          {row.stockQuantity}
        </span>
      ),
      center: true,
    },
    {
      name: "IsActive",
      selector: (row) => row.active.toString(),
      center: true,
      cell: (row) => <span>{row.active ? "🟢" : "🔴"}</span>,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="manage-products-action-cell">
          <button
            className="manage-product-edit-btn"
            disabled={!(row?.active)}
            onClick={() => openEditPopUpContainer(row)}
          >
            Edit
          </button>
          <button className={row?.active ? "manage-product-disable":"manage-product-enable"} onClick={()=>toggleProductActive(row?.productId)}>{row?.active ? "Disable":"Enable"}</button>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <div className="products-table">
      <div>
        <HeadingWithBullet heading={"Manage Products"} />
      </div>
      <div className="mproduct-add-btn-div">
        <button
          className="mproduct-add-btn"
          onClick={() => navigate("/admin/add-product")}
        >
          +
        </button>
      </div>

      {loading ? (
        <MyCustomLoader text={"Products on the way"} />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          customStyles={customStyles}
          pagination
        ></DataTable>
      )}

      {openEditPopUp && <div className="edit-product-overlay"></div>}
      {openEditPopUp && (
        <EditProductPopUp
          product={currentProduct}
          updateProducts={updateProducts}
          closeEditPopUpContainer={closeEditPopUpContainer}
        />
      )}
    </div>
  );
}

export default ManageProductsPage;

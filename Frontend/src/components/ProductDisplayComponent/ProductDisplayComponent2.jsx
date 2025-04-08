import "../../css/CategoryProductsPage.css";
import ProductCard from "../ProductCard/ProductCard";
import { ReactComponent as FilterIcon } from "../../assets/filter-by-list.svg";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCallback, useEffect, useState } from "react";
import Slider from '@mui/material/Slider';
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import ProductCardSkeleton from "../ProductCardSkeleton/ProductCardSkeleton";
import BrokenUrlDisplay from "../BrokenUrlDisplay/BrokenUrlDisplay";
import { debounce } from "lodash";

function ProductsDisplayComponent2({categoryNameStr}) {
  const [productsLoading,setProductsLoading]=useState(true);
  const [products,setProducts]=useState(null);
  const [category,setCategory]=useState(null);
  const [totalProductsNo,setTotalProductsNo]=useState(null)
  const [sortBy,setSortBy]=useState(null);
  const [discountFilter,setDiscountFilter]=useState(null);
  const [excludeSoldOut,setExcludeSoldOut]=useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [brokenUrl,setBrokenUrl]=useState(false);

  useEffect(()=>{
    async function getCategory(){
      await new Promise(resolve => setTimeout(resolve, 1000));
        try{
            let encodedCategory=encodeURIComponent(categoryNameStr)
            let response=await axios.get(`${process.env.REACT_APP_GET_CATEGORY_BY_CATEGORY_NAME}/${encodedCategory}`)
            setCategory(response.data.body)
        }catch(e){
            if(e.status===404){
              setBrokenUrl(true)
            }
        }
    }
    getCategory();
},[categoryNameStr])

  // Function to call the backend API with the filters
  const applyFilters = useCallback(async () => {
    try {
      setProductsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.get('http://localhost:8080/products/filter', {
        params: {
          categoryName: categoryNameStr ? categoryNameStr.toLowerCase() : null,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          excludeSoldOut: excludeSoldOut,
          discountFilter: discountFilter || null,
          sortBy: sortBy,
          page: 0, 
          size: 10, 
        }
      });

      setProducts(response.data.body.content);
      setTotalProductsNo(response.data.body.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setProductsLoading(false);
    }
  },[categoryNameStr,excludeSoldOut,priceRange,discountFilter,sortBy]);



  useEffect(() => {
    applyFilters();
  }, [
    categoryNameStr,
    sortBy,
    discountFilter,
    excludeSoldOut,
    priceRange,
    applyFilters
  ]);

  function handleSortByChange(e){
    setSortBy(e.target.value)
  }

  function handleDiscountChange(e){
    setDiscountFilter(Number(e.target.value))
  }

  function handleExcludeSoldOut(){
    setExcludeSoldOut(prev=>!prev)  
  }

  const handlePriceRangeChange = debounce((event, newValue) => {
    setPriceRange(newValue);
  },500);
  
  const clearFilters=()=>{
    setSortBy(null);
    setDiscountFilter(null);
    setExcludeSoldOut(false);
    setPriceRange([0, 20000]);
  }

  if(brokenUrl){
    return <BrokenUrlDisplay/>
  }

  return (
    <div className="category-products-page-main-flex-div">
      <div className="category-products-page-side-filter">
        <div className="filter-option-div">
          <div className="filter-icon-div">
            <FilterIcon className="category-products-filter-icon" />
            <span className="filters-text">Filters</span>
          </div>
          <button className="category-products-page-filter-reset-btn" onClick={clearFilters}>
            RESET
          </button>
        </div>
        
        <div className="category-products-filters mt-4">
          <Accordion className="category-product-page-filter-accordian">
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{color:"white"}}/>}>
              <p>SORT BY</p>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filter-div">
                <label htmlFor="PLH">Price - Low To High</label>
                <input id="PLH" type="radio" name="sortBy" value="PLH" checked={sortBy==="PLH"} onChange={handleSortByChange}></input>
              </div>

              <div className="filter-div">
                <label htmlFor="PHL">Price - High To Low</label>
                <input id="PHL" type="radio" name="sortBy" value="PHL" checked={sortBy==="PHL"} onChange={handleSortByChange}></input>
              </div>

              <div className="filter-div">
                <label htmlFor="DLH">Discount - Low To High</label>
                <input id="DLH" type="radio" name="sortBy" value="DLH" checked={sortBy==="DLH"} onChange={handleSortByChange}></input>
              </div>

              <div className="filter-div">
                <label htmlFor="DHL">Discount - High To Low</label>
                <input id="DHL" type="radio" name="sortBy" value="DHL" checked={sortBy==="DHL"} onChange={handleSortByChange}></input>
              </div>

            </AccordionDetails>
          </Accordion>

          <Accordion className="category-product-page-filter-accordian">
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{color:"white"}}/>}>
              <p>DISCOUNT</p>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filter-div">
                <label htmlFor="above10">10% And Above</label>
                <input id="above10" type="radio" name="discount" value={10} checked={discountFilter===10} onChange={handleDiscountChange}></input>
              </div>

              <div className="filter-div">
                <label htmlFor="above20">20% And Above</label>
                <input id="above10" type="radio" name="discount" value={20} checked={discountFilter===20} onChange={handleDiscountChange}></input>
              </div>


              <div className="filter-div">
                <label htmlFor="above30">30% And Above</label>
                <input id="above10" type="radio" name="discount" value={30} checked={discountFilter===30} onChange={handleDiscountChange}></input>
              </div>

              <div className="filter-div">
                <label htmlFor="above40">40% And Above</label>
                <input id="above10" type="radio" name="discount" value={40} checked={discountFilter===40} onChange={handleDiscountChange}></input>
              </div>

            </AccordionDetails>
          </Accordion>

          <Accordion className="category-product-page-filter-accordian">
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{color:"white"}}/>}>
              <p>STOCK AVAILABILITY</p>
            </AccordionSummary>
            <AccordionDetails>
              <div className="filter-div">
                <label htmlFor="excludeSoldOut">Exclude Sold Out</label>
                <input id="excludeSoldOut" type="checkbox" name="soldOut"  checked={excludeSoldOut} onChange={handleExcludeSoldOut}></input>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion className="category-product-page-filter-accordian">
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}>
              <p>PRICE</p>
            </AccordionSummary>
            <AccordionDetails>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value}`}
                min={139}
                max={20000}
                step={100}
                getAriaLabel={() => 'Price range'}
              />
              <p>₹{priceRange[0]} - ₹{priceRange[1]}</p>
            </AccordionDetails>
          </Accordion>

        </div>
        

      </div>

      <div className="category-products-page-products-container">
        <div className="category-products-category-heading-container">
          <h1 className="category-products-category-heading">
            {category?.categoryName ? category.categoryName : <Skeleton width="300px" />}
          </h1>
        </div>

        {category?.categoryDescription ? (
          <div className="category-products-page-category-description">
            <p className="category-products-page-category-description">
              {category?.categoryDescription}
            </p>
          </div>
        ) : (
          <Skeleton count={3}/>
        )}
        <hr></hr>
        <div className="no-of-products-count-div">
            <p className="no-of-products-count">
                {totalProductsNo} PRODUCTS AVAILABLE
            </p>
        </div>

        <div className="category-products-page-productcards">
          {productsLoading ? (
            <ProductCardSkeleton count={4}/>
          ) : (
            products?.map((product) => {
            return (
              <div className="category-products-page-productcard" key={product?.productId}>
                <ProductCard
                  slug={product?.slug}
                  stockQuantity={product?.stockQuantity}
                  imgURL={product?.primaryImageUrl}
                  productName={product?.productName}
                  basePrice={product?.basePrice}
                  discountedPrice={product?.discoutedPrice}
                  productId={product?.productId}
                  avgRating={product?.avgRating}
                />
              </div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsDisplayComponent2;

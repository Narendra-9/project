import "../../css/CategoryProductsPage.css";
import ProductCard from "../ProductCard/ProductCard";
import { ReactComponent as FilterIcon } from "../../assets/filter-by-list.svg";

function ProductsDisplayComponent(props) {
  const { products, category, totalProductsNo } = props;
  return (
    <div className="category-products-page-main-flex-div">
      <div className="category-products-page-side-filter">
        <div className="filter-option-div">
          <div className="filter-icon-div">
            <FilterIcon className="category-products-filter-icon" />
            <span className="filters-text">Filters</span>
          </div>
          <button className="category-products-page-filter-reset-btn">
            RESET
          </button>
        </div>
      </div>

      <div className="category-products-page-products-container">
        <div className="category-products-category-heading-container">
          <h1 className="category-products-category-heading">
            {category?.categoryName ? category?.categoryName : category}
          </h1>
        </div>

        {category?.categoryDescription && (
          <div className="category-products-page-category-description">
            <p className="category-products-page-category-description">
              {category?.categoryDescription}
            </p>
          </div>
        )}
        <hr></hr>
        <div className="no-of-products-count-div">
          <p className="no-of-products-count">
            {totalProductsNo} PRODUCTS AVAILABLE
          </p>
        </div>

        <div className="category-products-page-productcards">
          {products?.map((product) => {
            return (
              <div key={product?.productId} className="category-products-page-productcard">
                <ProductCard
                  slug={product?.slug}
                  stockQuantity={product?.stockQuantity}
                  imgURL={product?.primaryImageUrl}
                  productName={product.productName}
                  basePrice={product.basePrice}
                  discountedPrice={product.discoutedPrice}
                  productId={product.productId}
                  avgRating={product?.avgRating}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductsDisplayComponent;

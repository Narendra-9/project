import Modal from 'react-bootstrap/Modal';
import styles from "./MyModal.module.css"
import { formatCurrency } from '../../utils/formatCurrency';
function MyModal({show,handleClose,modalContent}) {
  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header  className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}><span>Order Id : #{modalContent.orderId}</span><span>Order Total : {formatCurrency(modalContent?.totalOrderAmount || 0)}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBodyCustomBg}>

        <h4 className={styles.modalOrderStatus}>Order Status : <span>{modalContent.orderStatus}</span></h4>

        <div className={styles.modalBodyCustom}>
            <div className='row'>
                {modalContent?.listOfOrderItems?.map((item,index) => {
                    return (
                    <div className='col-6' key={index}>
                        <div className={styles.modalOrderItem}>
                            <div className='modal-order-item-img'>
                                <img src={item.product.primaryImageUrl} style={{borderRadius:"10px",marginRight:"10px"}} height="80px" alt='prodct-img'></img>
                            </div>
                            <div className={styles.modalOrderItemContent}>
                                {/* <p>OrderItemId : #{item.orderItemsId}</p> */}
                                <p className={styles.productName}>{item.product.productName}</p>
                                <p>Quantity : {item.quantity}</p>
                                <p>TotalPrice: {item.totalPrice}</p>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
            
            
            <div className={styles.modalItemAddress}>
                <p><strong>Shipping Address:</strong></p>
                <p>
                    {modalContent.userAddress?.fullName}, {modalContent.userAddress?.mobileNo} <br />
                    {modalContent.userAddress?.address}, {modalContent.userAddress?.locality} <br />
                    {modalContent.userAddress?.city} - {modalContent.userAddress?.pincode}, {modalContent.userAddress?.state}
                </p>
            </div>

        </div>

        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>

          <button className={styles.closeBtn} onClick={handleClose}>
            Close
          </button>
          
          <button className={styles.saveBtn} onClick={handleClose}>
            Save Changes
          </button>

        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyModal;
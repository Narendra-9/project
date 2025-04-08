package com.endava.endavastrength.entities;

import java.time.LocalDateTime;
import java.util.List;

import com.endava.endavastrength.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long orderId;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private Users user;
	
	@OneToMany(mappedBy = "order",cascade = CascadeType.ALL,orphanRemoval = true,fetch = FetchType.EAGER)
	private List<OrderItems> listOfOrderItems;
	

	@ManyToOne
	@JoinColumn(name = "address_id")
	private UserAddress userAddress;
	
	@Enumerated(EnumType.STRING)
	private OrderStatus orderStatus;
	
	private long totalPrice;
	
	private long esCashUsed;
	
	private long totalOrderValue;
	
	private long esCashGained;
	
	@OneToOne(mappedBy = "order")
	private Payment payment;
	
	@OneToOne(mappedBy = "order")
	private PaymentSession paymentSession;
	
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
	

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
	

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
   
}

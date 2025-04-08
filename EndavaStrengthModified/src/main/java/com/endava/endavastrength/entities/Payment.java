package com.endava.endavastrength.entities;

import java.time.LocalDateTime;

import com.endava.endavastrength.enums.PaymentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long paymentId;
	
	private LocalDateTime paymentDate;
	
	private long paymentAmount;
	
	private String paymentMethod;
	
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
	
	@OneToOne
	@JoinColumn(name = "order_id")
	private Orders order;
	
}

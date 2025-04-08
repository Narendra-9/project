package com.endava.endavastrength.entities;

import java.time.LocalDateTime;

import com.endava.endavastrength.enums.PaymentSessionStatus;

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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSession {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long paymentSessionId;
	
	@OneToOne
	@JoinColumn(name = "order_id")
	private Orders order;
	
	@Enumerated(EnumType.STRING)
	private PaymentSessionStatus paymentSessionStatus;
	
	private LocalDateTime expiresAt;
	
	
}

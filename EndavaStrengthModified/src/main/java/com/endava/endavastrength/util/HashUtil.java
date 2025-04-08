package com.endava.endavastrength.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class HashUtil {
	
	@Value("${sha.my-salt}")
	private  String salt;
	
	public String hashCard(String cardNumber) throws NoSuchAlgorithmException {
		MessageDigest digest=MessageDigest.getInstance("SHA-256");
		String input=cardNumber+salt;
		byte[] hash=digest.digest(input.getBytes());
		return Base64.getEncoder().encodeToString(hash);
	}
}

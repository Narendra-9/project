package com.endava.endavastrength.util;

import java.text.Normalizer;
import java.util.Locale;

import com.endava.endavastrength.enums.ErrorMessage;

public class SlugUtil {
	

    private SlugUtil() {
        throw new UnsupportedOperationException(ErrorMessage.CANNOT_INSTANTIATED.getMessage());
    }
	
    public static String toSlug(String input) {
        if (input == null) return "";
        return  Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("[^\\w\\s-]", "")
                .replaceAll("\\s+", "-") 
                .toLowerCase(Locale.ENGLISH);
    }
    
}

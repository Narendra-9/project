package com.endava.endavastrength.util;

import org.springframework.data.domain.Page;

import com.endava.endavastrength.enums.ErrorMessage;
import com.endava.endavastrength.response.PagedResponse;

public class PaginationUtil {
	
    // Private constructor to prevent instantiation
    private PaginationUtil() {
        throw new UnsupportedOperationException(ErrorMessage.CANNOT_INSTANTIATED.getMessage());
    }

    public static <T> PagedResponse<T> toPagedResponse(Page<T> page) {
        return new PagedResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isLast()
        );
    }
}

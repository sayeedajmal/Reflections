package com.strong.reflections.Utils;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ReflectException.class)
    public ResponseEntity<ReflectExcResponse> handleReflectException(ReflectException ex) {
        ReflectExcResponse response = new ReflectExcResponse();
        response.setMessage(ex.getMessage());
        response.setStatus(ex.getStatus().value());
        response.setTimeStamp(System.currentTimeMillis());

        return new ResponseEntity<>(response, ex.getStatus());
    }
}
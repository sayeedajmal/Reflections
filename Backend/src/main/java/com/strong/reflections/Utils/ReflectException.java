package com.strong.reflections.Utils;

import org.springframework.http.HttpStatus;

public class ReflectException extends Exception {
    private HttpStatus status;

    public ReflectException() {
        super();
        this.status = HttpStatus.BAD_REQUEST;
    }

    public ReflectException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public ReflectException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public ReflectException(String message, Throwable throwable) {
        super(message, throwable);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public ReflectException(Throwable throwable) {
        super(throwable);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
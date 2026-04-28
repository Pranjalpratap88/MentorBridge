package com.myanatomy.sandboxpro.exception;

import org.springframework.http.HttpStatus;

/**
 * Application-level exception that carries an HTTP status and a clean,
 * user-facing message. Nothing internal (SQL, stack traces) ever leaks out.
 */
public class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public AppException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public HttpStatus getStatus() {
        return status;
    }
}

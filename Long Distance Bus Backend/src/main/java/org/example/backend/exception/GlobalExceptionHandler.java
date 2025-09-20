package org.example.backend.exception;

import org.example.backend.Util.APIResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handlerGenericException(Exception e){
        return new ResponseEntity<>(new APIResponse(
                500,
                e.getMessage(),
                null
        ), HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
    @ExceptionHandler(ResourseNotFound.class)
    public ResponseEntity<APIResponse> handlerGenericException(ResourseNotFound e){
        return new ResponseEntity<>(new APIResponse(
                404,
                e.getMessage(),
                null
        ), HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
    @ExceptionHandler(ResourseAllredyFound.class)
    public ResponseEntity<APIResponse> handlerGenericException(ResourseAllredyFound e){
        return new ResponseEntity<>(new APIResponse(
                302,
                e.getMessage(),
                null
        ), HttpStatus.FOUND
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e){
        Map<String,String> errors = new HashMap<>() ;
        e.getBindingResult().getFieldErrors().forEach(fieldError -> {
            errors.put(fieldError.getField(),fieldError.getDefaultMessage());
        });
        return new ResponseEntity<>(new APIResponse(
                400,
                "Validation failed",
                errors
        ), HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<APIResponse> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        return new ResponseEntity<>(
                new APIResponse(
                        409,
                        "Duplicate entry or constraint violation",
                        null
                ),
                HttpStatus.CONFLICT
        );
    }
}


package org.example.backend.exception;

public class ResourseNotFound extends RuntimeException{
    public ResourseNotFound(String massage){
        super(massage);
    }
}

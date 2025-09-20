package org.example.backend.exception;

public class ResourseAllredyFound extends RuntimeException{
    public ResourseAllredyFound(String massage){
        super(massage);
    }
}

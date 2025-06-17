package org.example.lab2web3231202.response;

public class BadResponse {
    private String message;

    public BadResponse() {
    }

    public BadResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

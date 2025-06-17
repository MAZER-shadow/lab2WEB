package org.example.lab2web3231202.response;

import org.example.lab2web3231202.entity.HitResult;

import java.util.ArrayList;

public class GoodResponse {
    private ArrayList<HitResult> hitResults;
    private String message;

    public GoodResponse() {
    }

    public GoodResponse(String message, ArrayList<HitResult> hitResults) {
        this.message = message;
        this.hitResults = hitResults;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ArrayList<HitResult> getHitResults() {
        return hitResults;
    }

    public void setHitResults(ArrayList<HitResult> hitResults) {
        this.hitResults = hitResults;
    }
}

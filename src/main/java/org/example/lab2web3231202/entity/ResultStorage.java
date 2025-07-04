package org.example.lab2web3231202.entity;

import java.util.ArrayList;

public class ListResult {
    private ArrayList<HitResult> results;

    public ListResult() {
        results = new ArrayList<>();
    }

    public ListResult(ArrayList<HitResult> results) {
        this.results = results;
    }

    public void clear() {
        results.clear();
    }

    public void addHitResult(HitResult hitResult) {
        results.add(hitResult);
    }

    public ArrayList<HitResult> getResults() {
        return results;
    }

    public void setResults(ArrayList<HitResult> results) {
        this.results = results;
    }
}

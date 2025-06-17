package org.example.lab2web3231202.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class HitResult {

    @JsonProperty
    private double x;

    @JsonProperty
    private double y;

    @JsonProperty
    private double r;

    @JsonProperty
    private boolean hitStatus;

    @JsonProperty
    private long executionTime;

    @JsonProperty
    private LocalDateTime timeStart;

    public HitResult() {
    }

    public HitResult(long x, long y, long r, boolean hitStatus, long executionTime, LocalDateTime timeStart) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hitStatus = hitStatus;
        this.executionTime = executionTime;
        this.timeStart = timeStart;
    }

    @Override
    public String toString() {
        return "Coordinates{" +
                "x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", hitStatus=" + hitStatus +
                '}';
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public boolean isHitStatus() {
        return hitStatus;
    }

    public void setHitStatus(boolean hitStatus) {
        this.hitStatus = hitStatus;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public LocalDateTime getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(LocalDateTime timeStart) {
        this.timeStart = timeStart;
    }
}

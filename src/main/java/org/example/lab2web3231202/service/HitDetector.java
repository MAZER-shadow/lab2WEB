package org.example.lab2web3231202.service;

public class HitDetection {
    public boolean identifyHit(double x, double y, double r) {
        if (x >= 0 && x <= r && y <= r / 2 && y >= 0) {
            return true;
        }

        if (x <= 0 && y >= 0 && y <= (x + r / 2)) {
            return true;
        }

        if (x >= 0 && y <= 0 && (x * x + y * y <= (r / 2) * (r / 2))) {
            return true;
        }

        return false;
    }
}

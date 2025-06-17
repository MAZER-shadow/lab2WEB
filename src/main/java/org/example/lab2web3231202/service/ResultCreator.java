package org.example.lab2web3231202.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.lab2web3231202.entity.HitResult;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;

public class ResultCreator {
    public HitResult createHitResult(byte[] requestBody, ObjectMapper mapper, LocalDateTime now) throws IOException {
        HitResult hitResult = mapper.readValue(new ByteArrayInputStream(requestBody), HitResult.class);
        HitDetection hitDetection = new HitDetection();
        hitResult.setHitStatus(hitDetection.identifyHit(hitResult.getX(), hitResult.getY(), hitResult.getR()));
        hitResult.setTimeStart(now);
        return hitResult;
    }
}

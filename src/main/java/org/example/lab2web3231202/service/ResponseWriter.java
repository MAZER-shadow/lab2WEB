package org.example.lab2web3231202.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.example.lab2web3231202.entity.HitResult;
import org.example.lab2web3231202.response.BadResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

public class ResponseWriter {
    public void writeResponse(HttpServletResponse response, String message, ObjectMapper mapper, boolean isError) throws IOException {
        PrintWriter writer = response.getWriter();
        if (isError) {
            BadResponse badResponse = new BadResponse(message);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValueAsString(badResponse);
            writer.write(mapper.writeValueAsString(badResponse));
            writer.close();
        } else {
            writer.write(message);
            writer.close();
        }
    }

    public void writeResponse(HttpServletResponse response, HitResult hitResult, ObjectMapper mapper) throws IOException {
        writeResponse(response, mapper.writeValueAsString(hitResult), mapper, false);
    }

    public void writeResponse(HttpServletResponse response, ArrayList<HitResult> list, ObjectMapper mapper) throws IOException {
        writeResponse(response, mapper.writeValueAsString(list), mapper, false);
    }
}

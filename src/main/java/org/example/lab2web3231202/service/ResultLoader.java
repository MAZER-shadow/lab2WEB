package org.example.lab2web3231202.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.lab2web3231202.entity.HitResult;
import org.example.lab2web3231202.entity.ListResult;

import java.io.IOException;
import java.util.ArrayList;

public class ResultLoader {
    public void loadResult(ObjectMapper mapper, HttpServletRequest request, HttpServletResponse response, ResponseWriter responseWriter) throws IOException {
        HttpSession session = request.getSession();
        if (session.getAttribute("list") != null) {
            ListResult listResult = (ListResult) session.getAttribute("list");
            responseWriter.writeResponse(response, listResult.getResults(), mapper);
        } else {
            ArrayList<HitResult> hitResultList = new ArrayList<>();
            responseWriter.writeResponse(response, hitResultList, mapper);
        }
    }
}

package org.example.lab2web3231202.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.lab2web3231202.entity.HitResult;
import org.example.lab2web3231202.entity.ListResult;
import org.example.lab2web3231202.response.GoodResponse;

import java.io.IOException;
import java.util.ArrayList;

public class ResultClear {
    public void clearResult(ObjectMapper mapper, HttpServletRequest request, HttpServletResponse response, ResponseWriter responseWriter) throws IOException {
        HttpSession session = request.getSession();
        if (session.getAttribute("list") != null && !((ListResult) session.getAttribute("list")).getResults().isEmpty()) {
            ListResult listResult = ((ListResult) session.getAttribute("list"));
            listResult.clear();
            GoodResponse goodResponse = new GoodResponse();
            goodResponse.setMessage("Успешное очещение");
            goodResponse.setHitResults(listResult.getResults());
            responseWriter.writeResponse(response, mapper.writeValueAsString(goodResponse), mapper, false);
        } else {
            ArrayList<HitResult> hitResultList = new ArrayList<>();
            GoodResponse goodResponse = new GoodResponse();
            goodResponse.setMessage("В коллекции ничего и не было)");
            goodResponse.setHitResults(hitResultList);
            responseWriter.writeResponse(response, mapper.writeValueAsString(goodResponse), mapper, false);
        }
    }
}

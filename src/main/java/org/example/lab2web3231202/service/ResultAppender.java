package org.example.lab2web3231202.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.lab2web3231202.entity.HitResult;
import org.example.lab2web3231202.entity.ListResult;

import java.util.ArrayList;

public class ResultAppender {
    public void appendResult(HitResult hitResult, HttpServletRequest request) {
        ListResult listResult = (ListResult) request.getSession().getAttribute("list");
        if (listResult == null) {
            ArrayList<HitResult> hitResultList = new ArrayList<>();
            listResult = new ListResult();
            listResult.setResults(hitResultList);
            request.getSession().setAttribute("list", listResult);
        }
        listResult.addHitResult(hitResult);
    }
}

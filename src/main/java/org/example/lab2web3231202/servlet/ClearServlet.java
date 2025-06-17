package org.example.lab2web3231202.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.lab2web3231202.service.ResponseWriter;
import org.example.lab2web3231202.service.ResultClear;

import java.io.IOException;

@WebServlet(name = "clearServlet", value = "/clear-servlet")
public class ClearServlet extends HttpServlet {
    private final ResultClear resultClear = new ResultClear();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ResponseWriter responseWriter = new ResponseWriter();

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resultClear.clearResult(objectMapper, req, resp, responseWriter);
    }
}

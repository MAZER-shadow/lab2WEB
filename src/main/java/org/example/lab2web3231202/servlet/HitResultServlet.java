package org.example.lab2web3231202.servlet;

import java.io.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.example.lab2web3231202.entity.HitResult;
import org.example.lab2web3231202.exception.InvalidDataException;
import org.example.lab2web3231202.service.*;

@WebServlet(name = "mainServlet", value = "/main-servlet")
public class MainServlet extends HttpServlet {
    private ResponseWriter responseWriter;
    private Validator validator;
    private final ResultCreator resultCreator = new ResultCreator();
    private final ResultAppender resultAppender = new ResultAppender();
    private final ResultLoader resultLoader = new ResultLoader();

    public void init() {
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        responseWriter = new ResponseWriter(mapper);
        validator = new Validator(mapper);

    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        resultLoader.loadResult(mapper, request, response, responseWriter);// загружаем прошлые результаты пользователя на страницу
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LocalDateTime now = LocalDateTime.now();
        long timeStart = System.nanoTime();
        byte[] requestBody = request.getInputStream().readAllBytes();
        try {
            validator.isValidData(requestBody); // валидация тела запроса
            HitResult hitResult = resultCreator.createHitResult(requestBody, mapper, now); // делаем результат попадания
            resultAppender.appendResult(hitResult, request); //добавляем результат в список всех результатов у пользователя
            hitResult.setExecutionTime(System.nanoTime() - timeStart);// ставим полученному результату время выполнения
            responseWriter.writeResponse(response, hitResult);// отправляем респонс
        } catch (InvalidDataException e) {
            responseWriter.writeResponse(response, e.getMessage(), true);// отправляем респонс
        }
    }

    public void destroy() {
    }
}

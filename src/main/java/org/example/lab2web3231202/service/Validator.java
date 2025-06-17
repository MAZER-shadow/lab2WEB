package org.example.lab2web3231202.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.io.JsonEOFException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;
import org.example.lab2web3231202.entity.HitResult;
import org.example.lab2web3231202.exception.InvalidDataException;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public class Validator {
    private final String ERROR_DATA_MESSAGE = "Данные не прошли валидацию: ";

    public void isValidData(byte [] requestBody, ObjectMapper mapper) throws IOException {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(requestBody);
        try {
            HitResult hitResult = mapper.readValue(inputStream, HitResult.class);

            double x = hitResult.getX();
            double y = hitResult.getY();
            double r = hitResult.getR();

            if (!(x >= -3 && x <= 3)) {
                throwError("x не является числом от -3 до 3");
            } else if (!(r >=2 && r <= 5)) {
                throwError("r не является числом от 2 до 5");
            } else if (!(y == -2 || y == -1.5 || y == -1 || y == -0.5 || y == 0 || y == 0.5 || y == 1 || y == 1.5 || y == 2)) {
                throwError("y не является числом из предложенной выборки");
            }
        } catch (JsonEOFException e) {
            throwError("отправили данные не в формате JSON");
        } catch (UnrecognizedPropertyException e) {
            throwError("проверьте что в запросе только x, y, r");
        } catch (JsonParseException e) {
            throwError("Проверьте что x, y, r являются числом");
        }
    }

    private void throwError(String errorMessage) {
        throw new InvalidDataException(ERROR_DATA_MESSAGE + errorMessage);
    }
}

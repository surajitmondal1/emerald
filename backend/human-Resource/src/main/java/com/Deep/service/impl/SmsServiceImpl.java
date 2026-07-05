package com.Deep.service.impl;

import com.Deep.service.SmsService;
import org.springframework.stereotype.Service;

@Service
public class SmsServiceImpl implements SmsService {

    @Override
    public void sendSms(String toPhone, String message) {
        System.out.println("=================================================");
        System.out.println("SMS SENT TO: " + toPhone);
        System.out.println("MESSAGE: " + message);
        System.out.println("=================================================");
    }
}

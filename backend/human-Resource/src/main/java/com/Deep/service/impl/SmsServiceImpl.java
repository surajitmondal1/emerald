package com.Deep.service.impl;

import com.Deep.service.SmsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {

    @Value("${twilio.account.sid:}")
    private String twilioSid;

    @Value("${twilio.auth.token:}")
    private String twilioToken;

    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendSms(String toPhone, String message) {
        System.out.println("=================================================");
        System.out.println("SMS INITIATED TO: " + toPhone);
        System.out.println("MESSAGE: " + message);
        System.out.println("=================================================");

        // 1. Try Fast2SMS (Best for Indian numbers)
        if (fast2smsApiKey != null && !fast2smsApiKey.trim().isEmpty()) {
            try {
                // Extract digits for OTP (e.g. "123456")
                String otp = message.replaceAll("\\D+", "");
                if (otp.length() > 6) {
                    otp = otp.substring(0, 6);
                }
                
                String cleanPhone = toPhone.replaceAll("\\D+", "");
                if (cleanPhone.startsWith("91") && cleanPhone.length() > 10) {
                    cleanPhone = cleanPhone.substring(cleanPhone.length() - 10);
                }

                String url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + fast2smsApiKey 
                           + "&variables_values=" + otp 
                           + "&route=otp&numbers=" + cleanPhone;

                ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    System.out.println("Fast2SMS OTP sent successfully!");
                    return;
                } else {
                    System.err.println("Failed to send Fast2SMS OTP: " + response.getBody());
                }
            } catch (Exception e) {
                System.err.println("Error sending Fast2SMS SMS: " + e.getMessage());
            }
        }

        // 2. Try Twilio
        if (twilioSid != null && !twilioSid.trim().isEmpty() &&
            twilioToken != null && !twilioToken.trim().isEmpty() &&
            twilioPhoneNumber != null && !twilioPhoneNumber.trim().isEmpty()) {
            try {
                String formattedPhone = toPhone.trim();
                if (!formattedPhone.startsWith("+")) {
                    formattedPhone = "+91" + formattedPhone;
                }

                String url = "https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json";
                
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                headers.setBasicAuth(twilioSid, twilioToken);

                String body = "To=" + formattedPhone + "&From=" + twilioPhoneNumber + "&Body=" + message;

                HttpEntity<String> request = new HttpEntity<>(body, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    System.out.println("Twilio SMS sent successfully!");
                    return;
                } else {
                    System.err.println("Failed to send Twilio SMS: " + response.getBody());
                }
            } catch (Exception e) {
                System.err.println("Error sending Twilio SMS: " + e.getMessage());
            }
        }

        // 3. Fallback to Textbelt (Sends 1 free SMS per day to a real phone number without keys)
        try {
            String formattedPhone = toPhone.trim();
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = "+91" + formattedPhone;
            }

            String url = "https://textbelt.com/text";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of(
                "number", formattedPhone,
                "message", message,
                "key", "textbelt"
            );

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<?, ?> resBody = response.getBody();
                Boolean success = (Boolean) resBody.get("success");
                if (Boolean.TRUE.equals(success)) {
                    System.out.println("Textbelt FREE SMS sent successfully to real phone: " + formattedPhone);
                    return;
                } else {
                    System.err.println("Textbelt free quota limit or error: " + resBody.get("error"));
                }
            }
        } catch (Exception e) {
            System.err.println("Error sending free Textbelt SMS: " + e.getMessage());
        }

        System.out.println("Mock logged above as fallback.");
    }
}

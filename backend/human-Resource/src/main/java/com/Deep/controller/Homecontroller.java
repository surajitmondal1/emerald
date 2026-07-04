package com.Deep.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class Homecontroller {
    public String home(){
        return "hello i am human-resource";
    }
}

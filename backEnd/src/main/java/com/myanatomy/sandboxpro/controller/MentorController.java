package com.myanatomy.sandboxpro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myanatomy.sandboxpro.service.HelloService;

@RestController
public class MentorController {

    @Autowired
    private HelloService helloService;

    @GetMapping("/hello")
    public String hello() {
        return helloService.getGreeting();
    }
}

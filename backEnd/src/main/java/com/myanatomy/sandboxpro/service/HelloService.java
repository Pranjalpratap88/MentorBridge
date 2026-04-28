package com.myanatomy.sandboxpro.service;

import org.springframework.stereotype.Service;

@Service
public class HelloService {
    public String getGreeting() {
        return "Welcome to SandboxPro!";
    }
}

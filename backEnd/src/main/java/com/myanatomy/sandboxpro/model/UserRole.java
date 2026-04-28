package com.myanatomy.sandboxpro.model;

public enum UserRole {
    STUDENT,        // Current student (not in final year)
    SENIOR_STUDENT, // Final year student
    ALUMNI,         // Graduate/Alumni
    MENTOR,         // Industry mentor
    ADMIN           // System administrator (not part of community roles)
}
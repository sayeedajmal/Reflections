package com.strong.reflections.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/actuator")
public class Actuator {

    /**
     * Returns the version of the Refection application.
     *
     * @return the version of the Refection application.
     */
    @GetMapping("/version")
    public String getActuator() {
        return "Refection V-1.0.0";
    }
}

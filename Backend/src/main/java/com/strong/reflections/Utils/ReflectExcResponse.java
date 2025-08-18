package com.strong.reflections.Utils;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ReflectExcResponse {
    private String Message;
    private Integer Status;
    private long TimeStamp;
}
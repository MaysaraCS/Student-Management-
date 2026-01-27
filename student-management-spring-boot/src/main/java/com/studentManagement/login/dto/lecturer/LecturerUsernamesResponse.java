package com.studentManagement.login.dto.lecturer;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LecturerUsernamesResponse {

    private List<String> usernames;
}
package com.studentManagement.login.config;

import com.studentManagement.login.entity.Lecturer;
import com.studentManagement.login.repository.LecturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no lecturers exist
        if (lecturerRepository.count() == 0) {
            System.out.println("Initializing database with 7 lecturers...");
            createLecturers();
            System.out.println("Database initialization complete!");
        } else {
            System.out.println("Lecturers already exist. Skipping initialization.");
        }
    }

    private void createLecturers() {
        // Create 7 lecturers with different departments
        createLecturer("Dr. Ahmed Hassan", "ahmed.hassan", "password123",
                "LEC001", "Computer Science", "ahmed.hassan@university.edu");

        createLecturer("Dr. Fatima Ali", "fatima.ali", "password123",
                "LEC002", "Mathematics", "fatima.ali@university.edu");

        createLecturer("Dr. Mohammed Khan", "mohammed.khan", "password123",
                "LEC003", "Physics", "mohammed.khan@university.edu");

        createLecturer("Dr. Sarah Ahmed", "sarah.ahmed", "password123",
                "LEC004", "Chemistry", "sarah.ahmed@university.edu");

        createLecturer("Dr. Omar Abdullah", "omar.abdullah", "password123",
                "LEC005", "Engineering", "omar.abdullah@university.edu");

        createLecturer("Dr. Layla Ibrahim", "layla.ibrahim", "password123",
                "LEC006", "Business Administration", "layla.ibrahim@university.edu");

        createLecturer("Dr. Yusuf Mansoor", "yusuf.mansoor", "password123",
                "LEC007", "Literature", "yusuf.mansoor@university.edu");
    }

    private void createLecturer(String name, String username, String password,
                                String lecturerId, String department, String email) {
        Lecturer lecturer = new Lecturer();
        lecturer.setName(name);
        lecturer.setUsername(username);
        lecturer.setPassword(passwordEncoder.encode(password));
        lecturer.setLecturerId(lecturerId);
        lecturer.setDepartment(department);
        lecturer.setEmail(email);
        lecturer.setIsActive(true);

        lecturerRepository.save(lecturer);
        System.out.println("Created lecturer: " + username + " (Password: " + password + ")");
    }
}
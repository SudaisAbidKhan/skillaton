import "dotenv/config.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./models/user.model.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017",
    );
    console.log("✓ Connected to MongoDB");

    // Clear existing users
    await userModel.deleteMany({});
    console.log("✓ Cleared existing users");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Admin user
    const adminUser = {
      name: "Admin User",
      email: "admin@cusit.edu.pk",
      password: hashedPassword,
      role: "admin",
      phone: "03001234567",
      department: "Administration",
      isActive: true,
    };

    // 10 Student users
    const studentUsers = [];
    for (let i = 1; i <= 10; i++) {
      studentUsers.push({
        name: `Student ${i}`,
        email: `student${i}@cusit.edu.pk`,
        password: hashedPassword,
        role: "student",
        phone: `0300${String(i).padStart(7, "0")}`,
        department: i % 2 === 0 ? "CS" : "SE",
        semester: (i % 8) + 1,
        studentId: `2020-${i % 2 === 0 ? "CS" : "SE"}-${String(i).padStart(3, "0")}`,
        registrationNumber: `CS-${2020 + Math.floor(i / 2)}-${String(i).padStart(3, "0")}`,
        isActive: true,
      });
    }

    // Insert admin
    await userModel.create(adminUser);
    console.log("✓ Created 1 admin user");
    console.log(`  Email: admin@cusit.edu.pk`);
    console.log(`  Password: password123`);

    // Insert students
    await userModel.insertMany(studentUsers);
    console.log("✓ Created 10 student users");
    studentUsers.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.email}`);
    });

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("   Admin:    admin@cusit.edu.pk / password123");
    console.log(
      "   Students: student1@cusit.edu.pk to student10@cusit.edu.pk / password123",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

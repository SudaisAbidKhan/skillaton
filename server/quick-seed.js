import "dotenv/config.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const seedQuick = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/skillaton",
    );
    console.log("Connected to MongoDB");

    const userCollection = mongoose.connection.collection("users");

    // Clear existing
    await userCollection.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Insert admin
    await userCollection.insertOne({
      name: "Admin User",
      email: "admin@cusit.edu.pk",
      password: hashedPassword,
      role: "admin",
      phone: "03001234567",
      department: "Administration",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert student
    await userCollection.insertOne({
      name: "Student 1",
      email: "student1@cusit.edu.pk",
      password: hashedPassword,
      role: "student",
      phone: "03001234568",
      department: "CS",
      semester: 6,
      studentId: "2020-CS-001",
      registrationNumber: "CS-2020-001",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Users inserted successfully!");
    console.log("Admin: admin@cusit.edu.pk / password123");
    console.log("Student: student1@cusit.edu.pk / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedQuick();

const express = require("express");
const router = express.Router();
const User = require("../../../models/UserModel");

// ✅ Get one student (by ID) or all students
router.get("/", async (req, res) => {
  try {
    const students = await User.find({ role: "STUDENT" });

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    res.status(200).json({
      success: true,
      total: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ✅ Route 2: Get one student by ID
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findOne({ _id: studentId, role: "STUDENT" });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not a STUDENT role",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const deletedStudent = await User.findOneAndDelete({ _id: studentId, role: "STUDENT" });

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not a STUDENT role",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting student by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

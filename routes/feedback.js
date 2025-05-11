const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Session = require("../models/Session");
const Feedback = require("../models/Feedback");
const mongoose = require("mongoose");
// Submit feedback
router.post("/submit", async (req, res) => {
  const { courseId, token, responses } = req.body;
  console.log(courseId, token, responses);
  try {
    const session = await Session.findById(token);
    console.log(session);
    if (!session) {
      return res.status(400).json({ error: "Invalid session token" });
    }
    const course = await Course.findById(courseId);
    console.log(course);
    if (!course) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const feedback = new Feedback({ courseId, responses });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error submitting feedback" });
  }
});

// Get all feedback responses for a course
router.get("/list/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    // Find the course by ID and populate relevant fields
    const course = await Course.findById(courseId).select(
      "professorName year type courseId courseName"
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find all feedback responses for the course and populate questions and options
    const feedbacks = await Feedback.find({ courseId }).populate({
      path: "responses.questionId",
      select: "text options answer", // Populate question text, options, and answer
    });

    res.status(200).json({
      courseDetails: {
        professorName: course.professorName,
        year: course.year,
        type: course.type,
        courseId: course.courseId,
        courseName: course.courseName,
      },
      feedbackResponses: feedbacks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching feedback responses" });
  }
});
// Get feedback for a specific course and session

// Get an individual feedback response by formResponseId
router.get("/list/individual/:formResponseId", async (req, res) => {
  const { formResponseId } = req.params;

  // Validate formResponseId
  if (!mongoose.Types.ObjectId.isValid(formResponseId)) {
    return res.status(400).json({ error: "Invalid formResponseId format" });
  }

  try {
    console.log("formResponseId:", formResponseId);

    // Find the feedback document containing the specific response ID
    const feedbackResponse = await Feedback.findOne({
        "_id":formResponseId,
      }).populate({
        path: "responses.questionId", // Populate questionId with DefaultQuestion details
        select: "text options type", // Select the fields you want to include
      });

 
    console.log("Query Result:", JSON.stringify(feedbackResponse, null, 2)); // Log the entire feedbackResponse object


    res.status(200).json({
      feedbackResponse: feedbackResponse, // Send the entire feedbackResponse object
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching feedback response" });
  }
});
module.exports = router;

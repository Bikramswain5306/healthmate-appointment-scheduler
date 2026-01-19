const express = require("express");
const app = express();

app.use(express.json());

const appointments = [];

// US-1.4: Appointment Booking Flow
app.post("/appointments/book", (req, res) => {
    const { patientName, doctorName, date, time } = req.body;

    if (!patientName || !doctorName || !date || !time) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = {
        id: appointments.length + 1,
        patientName,
        doctorName,
        date,
        time,
    };

    appointments.push(appointment);

    res.status(201).json({
        message: "Appointment booked successfully",
        appointment,
    });
});

app.listen(3000, () => {
    console.log("HealthMate server running on port 3000");
});

const express = require("express");
const app = express();

app.use(express.json());

// Available time slots per day (mock real-time data)
const availableSlots = {
    "2026-01-20": ["10:00", "11:00", "12:00"],
    "2026-01-21": ["09:00", "10:30", "14:00"],
};

// Active appointments
let appointments = [];

// Mock email service
function sendBookingEmail(patientName, appointment) {
    console.log(
        `EMAIL to ${patientName}: Appointment confirmed with Dr. ${appointment.doctorName} on ${appointment.date} at ${appointment.time}`
    );
}

// =================================================
// US-1.4: Get available slots for a selected date
// =================================================
app.get("/appointments/slots", (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({
            message: "Date is required",
        });
    }

    const slots = availableSlots[date] || [];

    res.json({
        date,
        availableSlots: slots,
    });
});

// ==============================================
// US-1.4: Book appointment (time slot selection)
// ==============================================
app.post("/appointments/book", (req, res) => {
    const { patientName, doctorName, date, time } = req.body;

    if (!patientName || !doctorName || !date || !time) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    const slots = availableSlots[date] || [];

    if (!slots.includes(time)) {
        return res.status(409).json({
            message: "Selected time slot is not available",
        });
    }

    const appointment = {
        id: appointments.length + 1,
        patientName,
        doctorName,
        date,
        time,
        status: "Booked",
    };

    // Remove booked slot (real-time availability update)
    availableSlots[date] = slots.filter((slot) => slot !== time);

    appointments.push(appointment);

    // Send confirmation email (mock)
    sendBookingEmail(patientName, appointment);

    res.status(201).json({
        message: "Appointment booked successfully",
        appointment,
    });
});

// ===============================
// Helper endpoints (optional)
// ===============================
app.get("/appointments", (req, res) => {
    res.json(appointments);
});

app.listen(3000, () => {
    console.log("HealthMate server running on port 3000");
});

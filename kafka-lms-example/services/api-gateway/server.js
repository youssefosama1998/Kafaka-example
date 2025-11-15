// server.js
import express from "express";
import bodyParser from "body-parser";
import { getKafka } from "./common/kafkaClient.js";

const app = express();
app.use(bodyParser.json());

const kafka = getKafka();
const producer = kafka.producer();

await producer.connect();
console.log("🚀 API Gateway connected to Kafka");

// POST /course
app.post("/course", async (req, res) => {
    const event = {
        type: "COURSE_PUBLISHED",
        payload: req.body,
        ts: Date.now(),
    };

    await producer.send({
        topic: "courses",
        messages: [{ key: req.body.id, value: JSON.stringify(event) }],
    });

    res.json({ sent: event });
});

// POST /enroll
app.post("/enroll", async (req, res) => {
    const event = {
        ...req.body,
        ts: Date.now(),
    };

    await producer.send({
        topic: "enrollments",
        messages: [
            {
                key: `${event.userId}:${event.courseId}`,
                value: JSON.stringify(event),
            },
        ],
    });

    res.json({ sent: event });
});

// POST /activity
app.post("/activity", async (req, res) => {
    const event = {
        ...req.body,
        ts: Date.now(),
    };

    await producer.send({
        topic: "activities",
        messages: [
            {
                key: `${event.userId}:${event.courseId}`,
                value: JSON.stringify(event),
            },
        ],
    });

    res.json({ sent: event });
});

app.listen(8088, () => console.log("🔥 API Gateway running on port 3000"));

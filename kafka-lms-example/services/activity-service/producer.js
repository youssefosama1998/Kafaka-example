import { getKafka } from "./common/kafkaClient.js";
const kafka = getKafka();
const producer = kafka.producer();

const users = ["u-1", "u-2", "u-3", "u-4"];
const courses = ["c-101", "c-102", "c-103"];
const activities = ["VIDEO_WATCHED", "QUIZ_SUBMITTED"];

const random = arr => arr[Math.floor(Math.random() * arr.length)];

async function run() {
  await producer.connect();
  console.log("🎥 Activity producer running...");

  while (true) {
    const act = random(activities);
    const event = {
      userId: random(users),
      courseId: random(courses),
      type: act,
      details:
        act === "VIDEO_WATCHED"
          ? { percent: Math.floor(Math.random() * 100) }
          : { percent: Math.floor(Math.random() * 100) },
      ts: Date.now(),
    };
    await producer.send({
      topic: "activities",
      messages: [{ key: `${event.userId}:${event.courseId}`, value: JSON.stringify(event) }],
    });
    console.log("Produced:", event);
    await new Promise(r => setTimeout(r, 4000)); // every 4s
  }
}

run().catch(console.error);

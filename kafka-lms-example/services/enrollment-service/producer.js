import { getKafka } from "../common/kafkaClient.js";
const kafka = getKafka();
const producer = kafka.producer();

const users = ["u-1", "u-2", "u-3", "u-4"];
const courses = ["c-101", "c-102", "c-103"];

const random = arr => arr[Math.floor(Math.random() * arr.length)];
const actions = ["ENROLL", "COMPLETE", "UNENROLL"];

async function run() {
  await producer.connect();
  console.log("🧾 Enrollment producer running...");

  while (true) {
    const event = {
      userId: random(users),
      courseId: random(courses),
      action: random(actions),
      ts: Date.now(),
    };
    await producer.send({
      topic: "enrollments",
      messages: [{ key: `${event.userId}:${event.courseId}`, value: JSON.stringify(event) }],
    });
    console.log("Produced:", event);
    await new Promise(r => setTimeout(r, 5000)); // every 5s
  }
}

run().catch(console.error);

import { getKafka } from "./common/kafkaClient.js";
const kafka = getKafka();
const producer = kafka.producer();

const courses = [
  { id: "c-101", title: "Intro to Kafka" },
  { id: "c-102", title: "Mastering Node.js" },
  { id: "c-103", title: "Microservices in Practice" },
];

const randomCourse = () => courses[Math.floor(Math.random() * courses.length)];

async function run() {
  await producer.connect();
  console.log("🎓 Course producer running...");

  while (true) {
    const c = randomCourse();
    const event = {
      type: "COURSE_PUBLISHED",
      payload: c,
      ts: Date.now(),
    };
    await producer.send({
      topic: "courses",
      messages: [{ key: c.id, value: JSON.stringify(event) }],
    });
    console.log("Produced:", event);
    await new Promise(r => setTimeout(r, 7000)); // every 7s
  }
}

run().catch(console.error);

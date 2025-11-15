import { getKafka } from "./common/kafkaClient.js";
const kafka = getKafka();
const consumer = kafka.consumer({ groupId: "certifier-group" });
const producer = kafka.producer();

const state = new Map();

async function run() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: "activities", fromBeginning: true });
  await consumer.subscribe({ topic: "enrollments", fromBeginning: true });

  console.log("🏅 Certifier service running...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = JSON.parse(message.value.toString());
      const id = `${value.userId}:${value.courseId}`;
      const entry = state.get(id) || { watched: false, quiz: 0, completed: false };

      if (topic === "activities") {
        if (value.type === "VIDEO_WATCHED" && value.details.percent >= 80) {
          entry.watched = true;
        } else if (value.type === "QUIZ_SUBMITTED") {
          entry.quiz = value.details.percent;
        }
      } else if (topic === "enrollments" && value.action === "COMPLETE") {
        entry.completed = true;
      }
      console.log('--------------------------------------> entryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy <------------------------------------');
      console.log(entry);
      console.log('--------------------------------------> entryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy <------------------------------------');

      if ((entry.watched && entry.quiz >= 80) || entry.completed) {
        const cert = {
          userId: value.userId,
          courseId: value.courseId,
          issuedAt: Date.now(),
        };
        await producer.send({
          topic: "certificates",
          messages: [{ key: id, value: JSON.stringify(cert) }],
        });
        console.log("✅ Certificate issued:", cert);
        state.delete(id);
      } else {
        state.set(id, entry);
      }
    },
  });
}

run().catch(console.error);

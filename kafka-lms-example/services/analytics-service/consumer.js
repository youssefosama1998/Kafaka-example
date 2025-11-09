import fs from "fs";
import { getKafka } from "../common/kafkaClient.js";
const kafka = getKafka();
const consumer = kafka.consumer({ groupId: "analytics-group" });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: "courses", fromBeginning: true });
  await consumer.subscribe({ topic: "activities", fromBeginning: true });
  await consumer.subscribe({ topic: "enrollments", fromBeginning: true });
  await consumer.subscribe({ topic: "certificates", fromBeginning: true });

  console.log("📈 Analytics consumer writing to data-lake.json...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const line = JSON.stringify({
        topic,
        value: JSON.parse(message.value.toString()),
        ts: Date.now(),
      });
      fs.appendFileSync("/app/data-lake.json", line + "\n");
      console.log("Data appended:", topic);
    },
  });
}

run().catch(console.error);

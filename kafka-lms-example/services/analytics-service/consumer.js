// consumer.js
import fs from "fs";
import { getKafka } from "./common/kafkaClient.js";
const kafka = getKafka();
const consumer = kafka.consumer({ groupId: "data-lake-group" });

const run = async () => {
    await consumer.connect();

    await consumer.subscribe({ topic: "courses", fromBeginning: true });
    await consumer.subscribe({ topic: "enrollments", fromBeginning: true });
    await consumer.subscribe({ topic: "activities", fromBeginning: true });
    await consumer.subscribe({ topic: "certificates", fromBeginning: true });

    console.log("Analytics consumer writing to data-lake.json");

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const line = JSON.stringify({ topic, key: message.key?.toString(), value: JSON.parse(message.value.toString()), ts: Date.now() });
            fs.appendFileSync("data-lake.json", line + "\n");
            console.log("Appended to data-lake:", topic, message.key?.toString());
        },
    });
};

run().catch(err => { console.error(err); process.exit(1); });

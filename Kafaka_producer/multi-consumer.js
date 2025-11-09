import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "data-lake-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "data-lake-group" });

const run = async () => {
  await consumer.connect();

  // Subscribe to multiple topics
  await consumer.subscribe({ topic: "orders", fromBeginning: true });
  await consumer.subscribe({ topic: "payments", fromBeginning: true });

  console.log("📡 Data lake consumer running...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Received from [${topic}] partition ${partition}: ${value}`);
    },
  });
};

run().catch(console.error);

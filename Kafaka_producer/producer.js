import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const messages = [
    { key: "user1", value: "Hello Kafka! 2" },
    { key: "user2", value: "This is a test message3" },
    { key: "user3", value: "KafkaJS is working 🎉 5" },
  ];

  await producer.send({
    topic: "test-topic",
    messages,
  });

  console.log("✅ Messages sent successfully!");
  await producer.disconnect();
};

run().catch(console.error);

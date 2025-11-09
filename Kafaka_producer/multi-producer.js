import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "multi-producer", brokers: ["localhost:9092"] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const orderMessages = [
    { key: "order1", value: JSON.stringify({ id: 1, user: "Alice", total: 120 }) },
    { key: "order2", value: JSON.stringify({ id: 2, user: "Bob", total: 95 }) },
  ];

  const paymentMessages = [
    { key: "payment1", value: JSON.stringify({ id: 1, orderId: 1, status: "SUCCESS" }) },
    { key: "payment2", value: JSON.stringify({ id: 2, orderId: 2, status: "FAILED" }) },
  ];

  await producer.send({ topic: "orders", messages: orderMessages });
  await producer.send({ topic: "payments", messages: paymentMessages });

  console.log("✅ Sent orders and payments!");
  await producer.disconnect();
};

run().catch(console.error);

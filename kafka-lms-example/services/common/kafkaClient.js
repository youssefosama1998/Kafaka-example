import { Kafka } from "kafkajs";

export function getKafka() {
  return new Kafka({
    clientId: "lms-demo",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  });
}

# Kafka LMS Example

This is a demonstration of an **event-driven architecture** using Kafka, Node.js, and Docker.  
The project simulates a **learning management system (LMS)** with courses, enrollments, activities, and certificate issuance.

It is designed for **demo purposes**, allowing you to produce events manually, consume them, and see real-time processing.

---

## 🛠 Tools Needed

Before running the project, make sure you have installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js >= 18](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)
- Optional: [Postman](https://www.postman.com/) or `curl` for sending API requests

---

## 🗂 Project Structure

kafka-lms-example/
│
├─ services/
│ ├─ api-gateway/ # HTTP API to produce events manually
│ │ └─ server.js
│ │
│ ├─ course-service/ # Old automated course producer (optional)
│ │ └─ producer.js
│ │
│ ├─ enrollment-service/ # Old automated enrollment producer (optional)
│ │ └─ producer.js
│ │
│ ├─ activity-service/ # Old automated activity producer (optional)
│ │ └─ producer.js
│ │
│ ├─ certifier/ # Processes activities/enrollments to issue certificates
│ │ └─ processor.js
│ │
│ ├─ analytics-service/ # Consumes all events and writes to data-lake.json
│ │ └─ consumer.js
│ │
│ └─ common/ # Shared Kafka client code
│
├─ data/
│ └─ data-lake.json # Analytics output
│
├─ docker-compose.yml
└─ .gitignore


---

## 📦 Services Explained

| Service | Purpose |
|---------|---------|
| **api-gateway** | Exposes HTTP API to produce events manually (`/course`, `/enroll`, `/activity`) |
| **course-service** | Old automated producer (can be replaced by API) |
| **enrollment-service** | Old automated producer (can be replaced by API) |
| **activity-service** | Old automated producer (can be replaced by API) |
| **certifier** | Listens to activities and enrollments, issues certificates when requirements are met, and produces them to `certificates` topic |
| **analytics-service** | Consumes all events from Kafka topics and writes them to `data/data-lake.json` for analytics purposes |
| **zookeeper** | Required by Kafka broker to manage cluster metadata |
| **kafka** | Kafka broker |
| **kafka-ui** | Web UI to monitor Kafka topics and messages |
| **prometheus** | Monitoring service |
| **grafana** | Dashboard for Prometheus metrics |

---

## 🚀 How to Run

1. **Start the Docker environment**


docker-compose up -d
This will start:

Kafka broker and Zookeeper

Certifier service

Analytics service

API gateway

Kafka UI, Prometheus, Grafana

2. **Access Kafka UI**

Open http://localhost:8080

3. **Send events manually via API**

**Course published:**

curl -X POST http://localhost:3000/course \
-H "Content-Type: application/json" \
-d '{"id": "c-101", "title": "Intro to Kafka"}'

**Enroll a user:**

curl -X POST http://localhost:3000/enroll \
-H "Content-Type: application/json" \
-d '{"userId": "u-1", "courseId": "c-101", "action": "ENROLL"}'

**Activity (video watched or quiz submitted):**

curl -X POST http://localhost:3000/activity \
-H "Content-Type: application/json" \
-d '{"userId": "u-1", "courseId": "c-101", "type": "VIDEO_WATCHED", "details": {"percent": 90}}'

**Analytics Output:** data/data-lake.json

📊 Monitoring

Kafka UI: http://localhost:8080
Prometheus: http://localhost:9090
Grafana: http://localhost:3000

📝 Summary

This project is a complete example of an event-driven LMS:

Users can enroll in courses

Activities are produced (videos, quizzes)

Certifier issues certificates automatically

Analytics service logs all events

Full monitoring with Kafka UI, Prometheus, Grafana

Manual API gateway allows controlled demo

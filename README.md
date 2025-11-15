# Kafka LMS Example

A demonstration of **event-driven architecture** using Kafka, Node.js, and Docker. This project simulates a **Learning Management System (LMS)** with courses, enrollments, activities, and automated certificate issuance.

**Purpose**: This is designed for demonstration and learning purposes, allowing you to produce events manually, consume them, and observe real-time event processing.

---

## 🛠 Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/get-npm) (v8+)
- Optional: [Postman](https://www.postman.com/) or `curl` for API testing

---

## 🗂 Project Structure
```
kafka-lms-example/
│
├── services/
│   ├── api-gateway/           # HTTP API for manual event production
│   │   ├── server.js
│   │   └── package.json
│   │   
│   │
│   ├── course-service/        # Automated course event producer (optional)
│   │   ├── producer.js
│   │   └── package.json
│   │   
│   │
│   ├── enrollment-service/    # Automated enrollment producer (optional)
│   │   ├── producer.js
│   │   └── package.json
│   │   
│   │
│   ├── activity-service/      # Automated activity producer (optional)
│   │   ├── producer.js
│   │   └── package.json
│   │   
│   │
│   ├── certifier/             # Certificate issuance processor
│   │   ├── processor.js
│   │   └── package.json
│   │   
│   │
│   ├── analytics-service/     # Event consumer for analytics
│   │   ├── consumer.js
│   │   └── package.json
│   │   
│   │
│   └── common/                # Shared Kafka client utilities
│       ├── kafka-client.js
│       └── package.json
│
├── data/
│   └── data-lake.json         # Analytics output storage
│
├── docker-compose.yml         # Docker services configuration
├── .gitignore
├── .env.example               # Environment variables template
└── README.md
```

---

## 📦 Services Overview

| Service | Purpose | Port |
|---------|---------|------|
| **api-gateway** | REST API for manual event production (`/course`, `/enroll`, `/activity`) | 3000 |
| **certifier** | Consumes enrollment and activity events; issues certificates when completion criteria are met | - |
| **analytics-service** | Consumes all events and aggregates them into `data/data-lake.json` | - |
| **course-service** | *(Optional)* Automated course event producer | - |
| **enrollment-service** | *(Optional)* Automated enrollment event producer | - |
| **activity-service** | *(Optional)* Automated activity event producer | - |
| **kafka** | Apache Kafka broker | 9092 |
| **zookeeper** | Manages Kafka cluster metadata | 2181 |
| **kafka-ui** | Web interface for Kafka monitoring | 8080 |
| **prometheus** | Metrics collection and monitoring | 9090 |
| **grafana** | Visualization dashboard for metrics | 3001 |

---

## 🚀 Getting Started

### 1. Clone and Setup
```bash
git clone <repository-url>
cd kafka-lms-example
```

### 2. Start the Environment
```bash
docker-compose up -d
```

This command starts all services including:
- Kafka broker and Zookeeper
- Certifier and Analytics services
- API Gateway
- Monitoring stack (Kafka UI, Prometheus, Grafana)

### 3. Verify Services are Running
```bash
docker-compose ps
```

All services should show "Up" status.

---

## 📡 API Usage Examples

### Publish a Course
```bash
curl -X POST http://localhost:3000/course \
  -H "Content-Type: application/json" \
  -d '{
    "id": "c-101",
    "title": "Introduction to Apache Kafka",
    "description": "Learn Kafka fundamentals",
    "duration": 120
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Course event published",
  "courseId": "c-101"
}
```

### Enroll a User
```bash
curl -X POST http://localhost:3000/enroll \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u-1",
    "courseId": "c-101",
    "action": "ENROLL"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Enrollment event published",
  "userId": "u-1",
  "courseId": "c-101"
}
```

### Record User Activity

**Video Watched:**
```bash
curl -X POST http://localhost:3000/activity \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u-1",
    "courseId": "c-101",
    "type": "VIDEO_WATCHED",
    "details": {
      "videoId": "v-201",
      "percentComplete": 100
    }
  }'
```

**Quiz Submitted:**
```bash
curl -X POST http://localhost:3000/activity \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u-1",
    "courseId": "c-101",
    "type": "QUIZ_SUBMITTED",
    "details": {
      "quizId": "q-301",
      "score": 85,
      "passed": true
    }
  }'
```

---

## 📊 Monitoring & Visualization

### Kafka UI
Monitor topics, messages, and consumer groups:
```
http://localhost:8080
```

### Prometheus Metrics
Access raw metrics:
```
http://localhost:9090
```

### Grafana Dashboards
Visualize system performance:
```
http://localhost:3001
```

**Default Credentials:**
- Username: `admin`
- Password: `admin`

---

## 📁 Data Storage

### Analytics Output

All consumed events are stored in:
```
data/data-lake.json
```

**Example structure:**
```json
{
  "courses": [
    {
      "id": "c-101",
      "title": "Introduction to Apache Kafka",
      "timestamp": "2025-11-15T10:30:00.000Z"
    }
  ],
  "enrollments": [
    {
      "userId": "u-1",
      "courseId": "c-101",
      "action": "ENROLL",
      "timestamp": "2025-11-15T10:31:00.000Z"
    }
  ],
  "activities": [
    {
      "userId": "u-1",
      "courseId": "c-101",
      "type": "VIDEO_WATCHED",
      "details": {"percentComplete": 100},
      "timestamp": "2025-11-15T10:35:00.000Z"
    }
  ],
  "certificates": [
    {
      "userId": "u-1",
      "courseId": "c-101",
      "issuedAt": "2025-11-15T10:40:00.000Z",
      "certificateId": "cert-12345"
    }
  ]
}
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:
```bash
# Kafka Configuration
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=lms-app

# Topics
TOPIC_COURSES=courses
TOPIC_ENROLLMENTS=enrollments
TOPIC_ACTIVITIES=activities
TOPIC_CERTIFICATES=certificates

# API Gateway
API_PORT=3000

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
KAFKA_UI_PORT=8080
```

---

## 🧪 Testing the Event Flow

### Complete User Journey

1. **Publish a course:**
```bash
curl -X POST http://localhost:3000/course \
  -H "Content-Type: application/json" \
  -d '{"id": "c-101", "title": "Kafka Mastery"}'
```

2. **Enroll a user:**
```bash
curl -X POST http://localhost:3000/enroll \
  -H "Content-Type: application/json" \
  -d '{"userId": "u-1", "courseId": "c-101", "action": "ENROLL"}'
```

3. **Complete activities:**
```bash
# Watch all videos
curl -X POST http://localhost:3000/activity \
  -H "Content-Type: application/json" \
  -d '{"userId": "u-1", "courseId": "c-101", "type": "VIDEO_WATCHED", "details": {"percentComplete": 100}}'

# Pass final quiz
curl -X POST http://localhost:3000/activity \
  -H "Content-Type: application/json" \
  -d '{"userId": "u-1", "courseId": "c-101", "type": "QUIZ_SUBMITTED", "details": {"score": 90, "passed": true}}'
```

4. **Check for certificate:**
   - View Kafka UI at `http://localhost:8080`
   - Check the `certificates` topic
   - Verify entry in `data/data-lake.json`

---

## 🛑 Stopping the Environment
```bash
# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Kafka Connection Issues
```bash
# Check Kafka logs
docker-compose logs kafka

# Verify Kafka is ready
docker-compose exec kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Service Not Starting
```bash
# Check specific service logs
docker-compose logs [service-name]

# Restart a specific service
docker-compose restart [service-name]
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

---

## 📚 Key Concepts Demonstrated

- **Event-Driven Architecture**: Loosely coupled services communicating via events
- **Event Sourcing**: All state changes captured as immutable events
- **Stream Processing**: Real-time event consumption and processing
- **CQRS Pattern**: Separate models for reading and writing data
- **Scalability**: Services can be scaled independently
- **Observability**: Full monitoring with Prometheus and Grafana

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For questions or issues:
- Open an issue in the repository
- Check existing documentation
- Review Kafka UI for event flow debugging

---

**Happy Event Streaming! 🚀**

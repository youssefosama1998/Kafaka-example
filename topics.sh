#!/usr/bin/env bash
set -e

BOOTSTRAP=localhost:9092

sudo docker compose exec kafka kafka-topics --create --topic courses \
  --bootstrap-server $BOOTSTRAP --partitions 3 --replication-factor 1 || true

sudo docker compose exec kafka kafka-topics --create --topic enrollments \
  --bootstrap-server $BOOTSTRAP --partitions 3 --replication-factor 1 || true

sudo docker compose exec kafka kafka-topics --create --topic activities \
  --bootstrap-server $BOOTSTRAP --partitions 3 --replication-factor 1 || true

sudo docker compose exec kafka kafka-topics --create --topic certificates \
  --bootstrap-server $BOOTSTRAP --partitions 1 --replication-factor 1 || true

sudo docker compose exec kafka kafka-topics --create --topic data-lake \
  --bootstrap-server $BOOTSTRAP --partitions 1 --replication-factor 1 || true

echo "Topics created"

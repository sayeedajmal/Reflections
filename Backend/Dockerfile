# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-11 AS builder
WORKDIR /app
COPY . . 
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=builder /app/target/backend-reflections-0.0.1-SNAPSHOT.jar app.jar
CMD ["java","-jar","app.jar"]

# Stage 1: Build with Maven
FROM maven:3.9.6-eclipse-temurin-11 as builder

WORKDIR /app
COPY ./Backend/ .     # copy your project
RUN mvn clean package -DskipTests

# Stage 2: Run JAR in lightweight JRE
FROM openjdk:11-jre-slim

WORKDIR /app
COPY --from=builder /app/target/backend-reflections-0.0.1-SNAPSHOT.jar app.jar

CMD ["java","-jar","app.jar"]

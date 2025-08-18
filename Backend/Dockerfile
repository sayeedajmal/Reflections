# Pull base image
FROM openjdk:11-jre-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the jar file to the current directory in the container
COPY ./target/backend-reflections-0.0.1-SNAPSHOT.jar .

# Run the jar file
CMD ["java","-jar", "backend-reflections-0.0.1-SNAPSHOT.jar"]

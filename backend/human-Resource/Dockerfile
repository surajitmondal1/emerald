# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/human-Resource-0.0.1-SNAPSHOT.jar app.jar
# Spring Boot automatically uses SERVER_PORT, and Render provides PORT
ENV SERVER_PORT=${PORT:-5001}
EXPOSE 5001
ENTRYPOINT ["java", "-jar", "app.jar"]

# MiniCRM — Backend Service

Enterprise-grade REST API service for MiniCRM built with **Java 21**, **Spring Boot 4**, **Spring Security**, and **PostgreSQL**.

---

## 🛠️ Tech Stack & Architecture

- **Java 21** & **Spring Boot 4**
- **Spring Security 7**: Stateless JWT authentication with custom filter chain
- **Spring Data JPA**: Hibernate ORM with clean repository patterns & custom aggregate queries
- **Flyway**: Production-grade database migrations (`db/migration/V1__init_schema.sql`)
- **PostgreSQL**: Relational database with strict enum checks and foreign key constraints
- **Testcontainers & JUnit 5**: Containerized integration tests against real PostgreSQL instances

---

## 📁 Package Structure

```
backend/src/
├── main/java/com/minicrm/
│   ├── auth/            # JWT Token provider, filter, controller, service, User entity & DTOs
│   ├── common/          # SecurityConfig, CORS policy, GlobalExceptionHandler
│   ├── contact/         # Contact entity, JPA repository with search query, service, controller
│   ├── deal/            # Deal entity, stages (LEAD, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST), service
│   ├── email/           # EmailLog entity, status tracker (SENT, OPENED, REPLIED, BOUNCED), service
│   ├── dashboard/       # Aggregation queries for deals by stage, email status, and KPIs
│   ├── DataSeeder.java  # Realistic demo seed data runner
│   └── MinicrmApplication.java # Spring Boot main runner
├── main/resources/
│   ├── db/migration/    # Flyway schema definitions
│   └── application.yml  # Environment-configured database and JWT properties
└── test/java/com/minicrm/ # JUnit 5 & Testcontainers integration test suites
```

---

## ⚡ Development & Scripts

```bash
# Compile and package JAR
mvn clean package -DskipTests

# Run all unit and integration tests (requires Docker for Testcontainers)
mvn verify

# Start backend locally
mvn spring-boot:run
```

---

## 🔒 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/minicrm` | PostgreSQL JDBC Connection URL |
| `DB_USERNAME` | `minicrm` | Database Username |
| `DB_PASSWORD` | `minicrm` | Database Password |
| `JWT_SECRET` | *(internal secret)* | Min 256-bit secret for HMAC SHA-512 JWT signature |
| `PORT` | `8080` | Web server port |

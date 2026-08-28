-- V1: Initial schema

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100),
    email       VARCHAR(255),
    phone       VARCHAR(50),
    company     VARCHAR(255),
    title       VARCHAR(100),
    source      VARCHAR(50),
    tags        TEXT[],
    notes       TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE deals (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id          BIGINT REFERENCES contacts(id) ON DELETE SET NULL,
    title               VARCHAR(255) NOT NULL,
    value               NUMERIC(15, 2) DEFAULT 0,
    stage               VARCHAR(20) NOT NULL DEFAULT 'LEAD',
    priority            VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    expected_close_date DATE,
    notes               TEXT,
    position            INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT deals_stage_check CHECK (stage IN ('LEAD','CONTACTED','QUALIFIED','PROPOSAL','WON','LOST')),
    CONSTRAINT deals_priority_check CHECK (priority IN ('LOW','MEDIUM','HIGH'))
);

CREATE TABLE email_logs (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id   BIGINT REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id      BIGINT REFERENCES deals(id) ON DELETE SET NULL,
    subject      VARCHAR(500) NOT NULL,
    body_preview TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'SENT',
    sent_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    opened_at    TIMESTAMP,
    replied_at   TIMESTAMP,
    CONSTRAINT email_logs_status_check CHECK (status IN ('SENT','OPENED','REPLIED','BOUNCED'))
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_contact_id ON email_logs(contact_id);

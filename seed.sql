DROP DATABASE IF EXISTS linkedlancer;
CREATE DATABASE linkedlancer;

\c linkedlancer


DROP VIEW IF EXISTS "ProjectView";

DROP VIEW IF EXISTS "ProjectView1";

DROP VIEW IF EXISTS "AccountView";

DROP TABLE IF EXISTS "Project";

DROP TABLE IF EXISTS "Account";

DROP TABLE IF EXISTS "AccountType";


CREATE TABLE "AccountType" (
 "TypeID"   SERIAL PRIMARY KEY,
 "TypeDescription" VARCHAR(45) NOT NULL
);

INSERT INTO "AccountType" ("TypeID", "TypeDescription") VALUES
    (1, 'Admin'),
    (2, 'Freelancer'),
    (3, 'Employer');


CREATE TABLE "Account" (
 "AccountID"   SERIAL PRIMARY KEY,
 "AccountEmail"       VARCHAR(100) NOT NULL,
 "AccountName"        VARCHAR(100) NOT NULL,
 "Password"    VARCHAR(45) NOT NULL,
 "TypeID"      INT NOT NULL REFERENCES "AccountType" ("TypeID")
);

INSERT INTO "Account" ("AccountID", "AccountName", "AccountEmail", "Password", "TypeID") VALUES
    (0, 'Dummy', 'dummy@linkedlancer.com', '123456', 1),
    (1, 'Abdulaziz', 'abdulaziz@linkedlancer.com', '123456', 1),
    (2, 'Fadi', 'fadi@linkedlancer.com', '123456', 2),
    (3, 'Ali', 'ali@linkedlancer.com', '123456', 3),
    (4, 'Hadi', 'hadi@linkedlancer.com', '123456', 3);


CREATE TABLE "Project" (
 "ProjectID"    SERIAL PRIMARY KEY,
 "ProjectName"         VARCHAR(45) NOT NULL,
 "ProjectBudget"       double precision NOT NULL,
 "ProjectRequirements" VARCHAR(255) NOT NULL,
 "ProjectStatus"       INT NOT NULL DEFAULT 1, -- Status 1 ? Available, 0 ? Not Available
 "AccountID"    INT NOT NULL REFERENCES "Account" ("AccountID"),
 "FreelancerID" INT NOT NULL DEFAULT 0,
 "DateCreated"  TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO "Project" ("ProjectName", "ProjectBudget", "ProjectRequirements", "ProjectStatus", "AccountID") VALUES
    ('Axenda', 1000000000, 'These are the requirements for Axenda project.', 1, 4),
    ('Facebook', 80000, 'These are the requirements for Facebook project.', 1, 3);


CREATE VIEW "AccountView" AS SELECT * FROM "Account"
    NATURAL JOIN "AccountType";

CREATE VIEW "ProjectView1" AS SELECT * FROM "Project" "P1"
    NATURAL JOIN "Account"
    NATURAL JOIN "AccountView";

CREATE VIEW "ProjectView" AS SELECT "P1".*, "A2"."AccountEmail" as "FreelancerEmail", "A2"."AccountName" as "FreelancerName" FROM "ProjectView1" "P1"
    INNER JOIN "Account" "A2" on "P1"."FreelancerID"="A2"."AccountID";

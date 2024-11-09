--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Debian 17.0-1.pgdg120+1)
-- Dumped by pg_dump version 17.0 (Debian 17.0-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: skynet
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO skynet;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: skynet
--

COMMENT ON SCHEMA public IS '';


--
-- Name: IDTYPE; Type: TYPE; Schema: public; Owner: skynet
--

CREATE TYPE public."IDTYPE" AS ENUM (
    'INTERNATIONALPASSPORT',
    'NIMC',
    'DRIVERSLISENCE',
    'VOTERSCARD'
);


ALTER TYPE public."IDTYPE" OWNER TO skynet;

--
-- Name: MaritalStatus; Type: TYPE; Schema: public; Owner: skynet
--

CREATE TYPE public."MaritalStatus" AS ENUM (
    'MARRIED',
    'SINGLE',
    'WIDOWED'
);


ALTER TYPE public."MaritalStatus" OWNER TO skynet;

--
-- Name: SourceOFincome; Type: TYPE; Schema: public; Owner: skynet
--

CREATE TYPE public."SourceOFincome" AS ENUM (
    'SALARYORBUSINESSINCOME',
    'INVESTMENTSORDIVIDENDS'
);


ALTER TYPE public."SourceOFincome" OWNER TO skynet;

--
-- Name: UserSex; Type: TYPE; Schema: public; Owner: skynet
--

CREATE TYPE public."UserSex" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."UserSex" OWNER TO skynet;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    username text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Admin" OWNER TO skynet;

--
-- Name: Cooperative; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."Cooperative" (
    id text NOT NULL,
    "cooperativeName" text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Cooperative" OWNER TO skynet;

--
-- Name: CooperativeDetails; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."CooperativeDetails" (
    "cooperativeId" text NOT NULL,
    "cooperativeName" text,
    email text,
    "registrationNumber" text NOT NULL,
    "dateOfIncorporation" timestamp(3) without time zone NOT NULL,
    address text NOT NULL,
    "phoneNumber" text NOT NULL,
    "totalSavings" double precision DEFAULT 0,
    "totalDebt" double precision DEFAULT 0,
    "totalLoansRequested" double precision DEFAULT 0,
    "totalLoansApproved" double precision DEFAULT 0,
    "totalMembers" text DEFAULT ''::text,
    "totalDebtors" text DEFAULT ''::text,
    "totalProfit" double precision DEFAULT 0,
    "directorName" text NOT NULL,
    "directorPosition" text NOT NULL,
    "directorEmail" text NOT NULL,
    "directorPhoneNumber" text NOT NULL,
    "directorDateOfBirth" timestamp(3) without time zone NOT NULL,
    "directorPlaceOfBirth" text NOT NULL,
    "directorNationality" text NOT NULL,
    "directorOccupation" text NOT NULL,
    "directorBVNNumber" text NOT NULL,
    "directorIDType" public."IDTYPE" NOT NULL,
    "directorIDNumber" text NOT NULL,
    "directorIssuedDate" text NOT NULL,
    "directorExpiryDate" text NOT NULL,
    "directorSourceOfIncome" public."SourceOFincome" NOT NULL,
    img text
);


ALTER TABLE public."CooperativeDetails" OWNER TO skynet;

--
-- Name: Debtor; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."Debtor" (
    id text NOT NULL,
    "memberId" text NOT NULL,
    "cooperativeId" text NOT NULL,
    "dateLoanReceived" timestamp(3) without time zone NOT NULL,
    "noOfMonths" integer NOT NULL,
    "membersCapital" double precision NOT NULL,
    "ordinarySavings" double precision NOT NULL,
    "specialSavings" double precision NOT NULL,
    "memberLoan" double precision NOT NULL,
    "interestOnLoan" double precision NOT NULL
);


ALTER TABLE public."Debtor" OWNER TO skynet;

--
-- Name: LoanInterestSetting; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."LoanInterestSetting" (
    id text NOT NULL,
    "cooperativeId" text NOT NULL,
    "minDurationMonths" integer,
    "maxDurationMonths" integer,
    "durationInterestRate" double precision,
    "minAmount" integer,
    "maxAmount" integer,
    "amountInterestRate" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LoanInterestSetting" OWNER TO skynet;

--
-- Name: LoansApproved; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."LoansApproved" (
    id text NOT NULL,
    "memberId" text NOT NULL,
    surname text,
    "firstName" text,
    "middleName" text,
    "membersNo" text,
    "purposeOfLoan" text NOT NULL,
    "balanceInTheSavingsAccount" text,
    "nameOfSurety1" text NOT NULL,
    "surety1MembersNo" text NOT NULL,
    "surety1telePhone" text NOT NULL,
    "surety1balanceInTheSavingsAccount" text,
    "nameOfSurety2" text NOT NULL,
    "surety2MembersNo" text NOT NULL,
    "surety2telePhone" text NOT NULL,
    "surety2balanceInTheSavingsAccount" text,
    "amountGuaranteed" text,
    "paymentVoucherNO" text,
    "cooperativeId" text NOT NULL,
    bvn text NOT NULL,
    "expectedReimbursementDate" timestamp(3) without time zone NOT NULL,
    "amountRequired" integer NOT NULL,
    "dateOfApplication" timestamp(3) without time zone,
    "durationOfLoan" integer NOT NULL,
    "amountGranted" integer,
    "loanInterest" integer,
    "repaymentsPrincipal" integer,
    "repaymentsInterest" integer,
    "balanceOutstandingPrincipal" integer,
    "balanceOutstandingInterest" integer,
    "balanceOutstandingTotal" integer
);


ALTER TABLE public."LoansApproved" OWNER TO skynet;

--
-- Name: LoansRequested; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."LoansRequested" (
    id text NOT NULL,
    "memberId" text NOT NULL,
    surname text,
    "firstName" text,
    "middleName" text,
    "membersNo" text,
    "purposeOfLoan" text NOT NULL,
    "balanceInTheSavingsAccount" text,
    bvn text NOT NULL,
    "nameOfSurety1" text NOT NULL,
    "surety1MembersNo" text NOT NULL,
    "surety1telePhone" text NOT NULL,
    "surety1balanceInTheSavingsAccount" text,
    "nameOfSurety2" text NOT NULL,
    "surety2MembersNo" text NOT NULL,
    "surety2telePhone" text NOT NULL,
    "surety2balanceInTheSavingsAccount" text,
    "amountGuaranteed" text,
    "paymentVoucherNO" text,
    approved boolean,
    rejected boolean,
    pending boolean,
    "cooperativeId" text NOT NULL,
    "durationOfLoan" integer NOT NULL,
    "amountRequired" integer NOT NULL,
    "loanInterest" integer,
    "amountGranted" integer,
    "repaymentsPrincipal" integer,
    "repaymentsInterest" integer,
    "balanceOutstandingPrincipal" integer,
    "balanceOutstandingInterest" integer,
    "balanceOutstandingTotal" integer,
    "dateOfApplication" timestamp(3) without time zone,
    "expectedReimbursementDate" timestamp(3) without time zone NOT NULL,
    "interestRate" double precision
);


ALTER TABLE public."LoansRequested" OWNER TO skynet;

--
-- Name: Member; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."Member" (
    id text NOT NULL,
    surname text NOT NULL,
    "cooperativeId" text,
    "firstName" text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public."Member" OWNER TO skynet;

--
-- Name: MemberSavings; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."MemberSavings" (
    id text NOT NULL,
    "memberId" text NOT NULL,
    "cooperativeId" text NOT NULL,
    surname text,
    "firstName" text,
    "middleName" text,
    "dateOfEntry" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    telephone text,
    "totalWithdrawals" integer NOT NULL,
    "savingsDeposits" integer NOT NULL,
    withdrawals integer NOT NULL,
    "savingsBalance" integer NOT NULL,
    "grandTotal" integer NOT NULL,
    "savingsFrequency" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."MemberSavings" OWNER TO skynet;

--
-- Name: MembersDetails; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."MembersDetails" (
    id text NOT NULL,
    "cooperativeId" text,
    "memberId" text NOT NULL,
    bvn text NOT NULL,
    "middleName" text NOT NULL,
    "dateOfEntry" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    telephone1 text NOT NULL,
    telephone2 text NOT NULL,
    "dateOfBirth" text NOT NULL,
    sex public."UserSex" NOT NULL,
    "maritalStatus" text NOT NULL,
    occupation text NOT NULL,
    business text NOT NULL,
    "residentialAddress" text NOT NULL,
    lga text NOT NULL,
    state text NOT NULL,
    "permanentHomeAddress" text NOT NULL,
    "stateOfOrigin" text NOT NULL,
    lga2 text NOT NULL,
    "amountPaid" text NOT NULL,
    "nextOfKinName" text NOT NULL,
    "nextOfKinPhone" text NOT NULL,
    "nextOfKinPhone2" text NOT NULL,
    sponsor text NOT NULL,
    "accountNumber" text NOT NULL,
    "bankName" text NOT NULL,
    img text
);


ALTER TABLE public."MembersDetails" OWNER TO skynet;

--
-- Name: MembersFinancialPosition; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."MembersFinancialPosition" (
    id text NOT NULL,
    "memberId" text NOT NULL,
    surname text NOT NULL,
    "firstName" text NOT NULL,
    "middleName" text NOT NULL,
    "dateOfEntry" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    telephone text NOT NULL,
    "membersCapital" text NOT NULL,
    "ordinarySavings" text NOT NULL,
    "specialSavings" text NOT NULL,
    "membersLoan" text NOT NULL,
    "interestOnMembersLoan" text NOT NULL,
    "BOILoans" text NOT NULL,
    "grandTotal" text NOT NULL,
    "intOnLoanAccrued" text NOT NULL
);


ALTER TABLE public."MembersFinancialPosition" OWNER TO skynet;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    "isGlobal" boolean NOT NULL,
    "memberId" text,
    "cooperativeId" text
);


ALTER TABLE public."Role" OWNER TO skynet;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO skynet;

--
-- Name: personalLedgers; Type: TABLE; Schema: public; Owner: skynet
--

CREATE TABLE public."personalLedgers" (
    id text NOT NULL,
    "memberId" text NOT NULL,
    surname text NOT NULL,
    "firstName" text NOT NULL,
    "middleName" text NOT NULL,
    "membersNo" text NOT NULL,
    telephone text NOT NULL,
    date text NOT NULL,
    "entranceFee" text NOT NULL,
    "shareCapital" text NOT NULL,
    "savingsDeposits" text NOT NULL,
    withdrawals text NOT NULL,
    "savingsBalance" text NOT NULL,
    "loanRecieved" text NOT NULL,
    "loanRepayed" text NOT NULL,
    "loanBalance" text NOT NULL,
    "goodsAndServices" text NOT NULL,
    "paymentsMade" text NOT NULL,
    balance text NOT NULL,
    "interestCharged" text NOT NULL,
    "interestPaid" text NOT NULL,
    "interestBalance" text NOT NULL
);


ALTER TABLE public."personalLedgers" OWNER TO skynet;

--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."Admin" (id, username, "createdAt") FROM stdin;
\.


--
-- Data for Name: Cooperative; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."Cooperative" (id, "cooperativeName", email, "createdAt") FROM stdin;
OJ3YoR9oPYc6Mg4okc8G5JJK0lk2	NEO	neowalker502@gmail.com	2024-10-18 04:17:49.578
WtXAKB38NXhOGqZ0oEEvGAkOzE72	RYUJIN	adneo502@gmail.com	2024-10-18 04:20:12.479
i8jsMWU6SdUiMztugxUlU7v5t7w2	NTSA	nemfeedback@gmail.com	2024-10-22 21:17:07.013
\.


--
-- Data for Name: CooperativeDetails; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."CooperativeDetails" ("cooperativeId", "cooperativeName", email, "registrationNumber", "dateOfIncorporation", address, "phoneNumber", "totalSavings", "totalDebt", "totalLoansRequested", "totalLoansApproved", "totalMembers", "totalDebtors", "totalProfit", "directorName", "directorPosition", "directorEmail", "directorPhoneNumber", "directorDateOfBirth", "directorPlaceOfBirth", "directorNationality", "directorOccupation", "directorBVNNumber", "directorIDType", "directorIDNumber", "directorIssuedDate", "directorExpiryDate", "directorSourceOfIncome", img) FROM stdin;
OJ3YoR9oPYc6Mg4okc8G5JJK0lk2	NEO	neowalker@gmail.com	RG-2900	2024-09-30 00:00:00	places in places	08074250008	0	0	0	0			0	Daniel	Billionaire	adneo502@gmail.com	07067275658	2024-10-07 00:00:00	Lagos	Nigerian	Billionaire	35353253252	NIMC	24234232	2024-10-15	2024-10-15	INVESTMENTSORDIVIDENDS	\N
WtXAKB38NXhOGqZ0oEEvGAkOzE72	RYUJiN	adneo502@gmail.com	RG-290090	2024-10-01 00:00:00	places in places	090837329283	0	0	0	0			0	Daniel	Billionaire	adedaniel502@gmail.com	07067275658	2024-10-15 00:00:00	place	Nigerian	Billionaire	32543523527	INTERNATIONALPASSPORT	24234232	2024-10-08	2024-10-07	INVESTMENTSORDIVIDENDS	\N
\.


--
-- Data for Name: Debtor; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."Debtor" (id, "memberId", "cooperativeId", "dateLoanReceived", "noOfMonths", "membersCapital", "ordinarySavings", "specialSavings", "memberLoan", "interestOnLoan") FROM stdin;
\.


--
-- Data for Name: LoanInterestSetting; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."LoanInterestSetting" (id, "cooperativeId", "minDurationMonths", "maxDurationMonths", "durationInterestRate", "minAmount", "maxAmount", "amountInterestRate", "createdAt") FROM stdin;
6977f9b6-7566-4dab-936a-bebbeb8adf2f	WtXAKB38NXhOGqZ0oEEvGAkOzE72	1	3	5	1000	5000	3	2024-11-06 13:04:43.485
6bc64b55-d750-4f78-b305-e1d8d098045b	WtXAKB38NXhOGqZ0oEEvGAkOzE72	4	6	7	5001	15000	8	2024-11-06 13:05:46.687
118c939a-f8bc-40cb-beb6-754f43af72cd	WtXAKB38NXhOGqZ0oEEvGAkOzE72	\N	\N	\N	15001	50000	12	2024-11-06 13:42:12.541
\.


--
-- Data for Name: LoansApproved; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."LoansApproved" (id, "memberId", surname, "firstName", "middleName", "membersNo", "purposeOfLoan", "balanceInTheSavingsAccount", "nameOfSurety1", "surety1MembersNo", "surety1telePhone", "surety1balanceInTheSavingsAccount", "nameOfSurety2", "surety2MembersNo", "surety2telePhone", "surety2balanceInTheSavingsAccount", "amountGuaranteed", "paymentVoucherNO", "cooperativeId", bvn, "expectedReimbursementDate", "amountRequired", "dateOfApplication", "durationOfLoan", "amountGranted", "loanInterest", "repaymentsPrincipal", "repaymentsInterest", "balanceOutstandingPrincipal", "balanceOutstandingInterest", "balanceOutstandingTotal") FROM stdin;
ace692e2-d9af-465b-9fad-ceacbae75ea0	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Business	\N	Dan	34534	090827635467	\N	Ade	45353	08092736126	\N	\N	\N	WtXAKB38NXhOGqZ0oEEvGAkOzE72	55235523253	2025-02-22 20:38:15.43	400	\N	4	400	13	\N	\N	\N	\N	\N
c4ec1cd4-8471-44c7-bccb-63ee2c8afa69	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Business	\N	Dan	34534	090827635467	\N	Ade	45353	08092736126	\N	\N	\N	WtXAKB38NXhOGqZ0oEEvGAkOzE72	55235523253	2025-02-22 20:38:15.43	400	\N	4	400	13	\N	\N	\N	\N	\N
70a5cddb-6bba-430d-a1e6-62d4b77945c3	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Payments	\N	Dare	09092837364	090338398839	\N	Ranny	09028383829	90928323839	\N	\N	\N	WtXAKB38NXhOGqZ0oEEvGAkOzE72	09338475618	2025-04-24 06:34:31.869	700	\N	6	700	35	\N	\N	\N	\N	\N
b7ef10c6-d230-4679-91d2-6a4777e2bd7b	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Payments	\N	Dare	09092837364	090338398839	\N	Ranny	09028383829	90928323839	\N	\N	\N	WtXAKB38NXhOGqZ0oEEvGAkOzE72	09338475618	2025-04-24 06:34:31.869	700	\N	6	700	35	\N	\N	\N	\N	\N
6d51fc7f-6263-4191-9afa-3af1ec15405c	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Payments	\N	Dare	09092837364	090338398839	\N	Ranny	09028383829	90928323839	\N	\N	\N	WtXAKB38NXhOGqZ0oEEvGAkOzE72	09338475618	2025-04-24 06:34:31.869	700	\N	6	700	35	\N	\N	\N	\N	\N
7b6941cc-5885-4599-a412-d81fdf6a4106	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	\N	\N	\N	\N	Business	\N	Dan	34534	090827635467	\N	Ade	45353	08092736126	\N	\N	\N	WtXAKB38NXhOGqZ0oEEvGAkOzE72	55235523253	2025-03-24 11:24:06.51	400	\N	5	400	16	\N	\N	\N	\N	\N
\.


--
-- Data for Name: LoansRequested; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."LoansRequested" (id, "memberId", surname, "firstName", "middleName", "membersNo", "purposeOfLoan", "balanceInTheSavingsAccount", bvn, "nameOfSurety1", "surety1MembersNo", "surety1telePhone", "surety1balanceInTheSavingsAccount", "nameOfSurety2", "surety2MembersNo", "surety2telePhone", "surety2balanceInTheSavingsAccount", "amountGuaranteed", "paymentVoucherNO", approved, rejected, pending, "cooperativeId", "durationOfLoan", "amountRequired", "loanInterest", "amountGranted", "repaymentsPrincipal", "repaymentsInterest", "balanceOutstandingPrincipal", "balanceOutstandingInterest", "balanceOutstandingTotal", "dateOfApplication", "expectedReimbursementDate", "interestRate") FROM stdin;
913cc98e-572b-40b2-ab5c-d5729bcdbbc7	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	\N	\N	\N	\N	Business	\N	55235523253	Dan	34534	090827635467	\N	Ade	45353	08092736126	\N	\N	\N	t	f	f	WtXAKB38NXhOGqZ0oEEvGAkOzE72	5	200	16	300	\N	\N	\N	\N	\N	\N	2025-03-24 11:24:06.51	\N
ace692e2-d9af-465b-9fad-ceacbae75ea0	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Business	\N	55235523253	Dan	34534	090827635467	\N	Ade	45353	08092736126	\N	\N	\N	t	f	f	WtXAKB38NXhOGqZ0oEEvGAkOzE72	4	400	13	200	\N	\N	\N	\N	\N	\N	2025-02-22 20:38:15.43	\N
19a6ea19-3406-4e09-9bf6-bc6ba3dded65	cLlKfIdKMsaScm5IQSTWTI9y1pM2	\N	\N	\N	\N	Payments	\N	09338475618	Dare	09092837364	090338398839	\N	Ranny	09028383829	90928323839	\N	\N	\N	f	t	f	WtXAKB38NXhOGqZ0oEEvGAkOzE72	6	700	35	700	\N	\N	\N	\N	\N	\N	2025-04-24 06:34:31.869	\N
db10ec6f-84b4-4407-a5e2-1b1072e65ade	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	\N	\N	\N	\N	Business	\N	56786543578	Dan	34534	090827635467	\N	Ade	45353	08092736126	\N	\N	\N	\N	\N	t	WtXAKB38NXhOGqZ0oEEvGAkOzE72	4	6000	200	20000	\N	\N	\N	\N	\N	\N	2025-03-05 04:12:37.333	\N
293fec2f-b8bd-46b5-b9a6-8a648b4b6c7b	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	\N	\N	\N	\N	Bizz	\N	74823742894	hdcsj	090826747372	09092038292	\N	jcjskcsj	45353	08092736126	\N	\N	\N	\N	\N	t	WtXAKB38NXhOGqZ0oEEvGAkOzE72	5	30000	1250	30000	\N	\N	\N	\N	\N	\N	2025-04-06 14:36:57.075	\N
\.


--
-- Data for Name: Member; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."Member" (id, surname, "cooperativeId", "firstName", email) FROM stdin;
PyR14SzsKHWYHeU0SCBRW7lHDfi2	Daniel	OJ3YoR9oPYc6Mg4okc8G5JJK0lk2	oyeniyi	adedaniel502@gmail.com
cLlKfIdKMsaScm5IQSTWTI9y1pM2	Timmy	WtXAKB38NXhOGqZ0oEEvGAkOzE72	Ade	adetimilehin502@gmail.com
5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	Daniel	WtXAKB38NXhOGqZ0oEEvGAkOzE72	oyeniyi	test@test.com
Sis61KwG9MM5xB3MOgxvakLrRDV2	Oloye	WtXAKB38NXhOGqZ0oEEvGAkOzE72	Ade	asde@ade.com
bkYnyvaNHfbah382iHG79N5OI9K2	Walker	WtXAKB38NXhOGqZ0oEEvGAkOzE72	Tracy	tracy@tracy.com
\.


--
-- Data for Name: MemberSavings; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."MemberSavings" (id, "memberId", "cooperativeId", surname, "firstName", "middleName", "dateOfEntry", telephone, "totalWithdrawals", "savingsDeposits", withdrawals, "savingsBalance", "grandTotal", "savingsFrequency") FROM stdin;
9407f041-f834-4164-b073-4514288553e2	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	WtXAKB38NXhOGqZ0oEEvGAkOzE72	\N	\N	\N	2024-10-27 04:00:37.516	\N	0	5000	0	5000	5000	1
595e295b-855c-4565-88b8-1a8918baf751	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	WtXAKB38NXhOGqZ0oEEvGAkOzE72	\N	\N	\N	2024-10-27 04:04:44.843	\N	0	15000	0	20000	20000	2
82bdb190-75f6-46e9-9a11-2c0cc1c1eba7	Sis61KwG9MM5xB3MOgxvakLrRDV2	WtXAKB38NXhOGqZ0oEEvGAkOzE72	\N	\N	\N	2024-10-27 10:54:32.918	\N	0	100	0	100	100	1
104e2f0c-5f92-4d97-8a63-6717241bb42c	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	WtXAKB38NXhOGqZ0oEEvGAkOzE72	\N	\N	\N	2024-10-31 05:48:07.187	\N	0	2000	0	22000	22000	3
e25c1b0c-ac41-46d6-a1d3-9aa0e61ce176	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	WtXAKB38NXhOGqZ0oEEvGAkOzE72	\N	\N	\N	2024-10-31 12:40:39.657	\N	0	1000	0	23000	23000	4
\.


--
-- Data for Name: MembersDetails; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."MembersDetails" (id, "cooperativeId", "memberId", bvn, "middleName", "dateOfEntry", telephone1, telephone2, "dateOfBirth", sex, "maritalStatus", occupation, business, "residentialAddress", lga, state, "permanentHomeAddress", "stateOfOrigin", lga2, "amountPaid", "nextOfKinName", "nextOfKinPhone", "nextOfKinPhone2", sponsor, "accountNumber", "bankName", img) FROM stdin;
2d1709d4-e1f9-4506-95c2-bd9e1f0df7de	\N	cLlKfIdKMsaScm5IQSTWTI9y1pM2	55235523253	Ademola	2024-10-10 00:00:00	08141252812	07067275658	2024-10-07T00:00:00.000Z	MALE	SINGLE	Billionaire	tech	asude, FUTA akure Ondo	vi	Ondo	asude, FUTA akure Ondo	Ondo	banana island	24,000,000	name	07067275658	09038384393	NIKE			\N
5edb87d3-ab53-42da-8b66-98be3baed29d	\N	5NOuv2nE7HPwAc1FgoWsQ3QgDFw1	56786543578	sgse	2024-10-02 00:00:00	080374632728	0908374632	2024-10-01T00:00:00.000Z	FEMALE	SINGLE	Cyber Analyst	tech	asude, FUTA akure Ondo	vi	Ondo	asude, FUTA akure Ondo	Ondo	banana island	24,000,000	name	07067275658	08075757885	NIKE			\N
d596f7e3-093a-4f74-a8ac-4d270464905a	\N	PyR14SzsKHWYHeU0SCBRW7lHDfi2	93034259348	claire	2024-10-10 00:00:00	0930485746	09028374637	2024-10-15T00:00:00.000Z	FEMALE	SINGLE	Financial advisor	Finance	Dutse	Gwagwalada	Abuja	Aso rock	Oyo	Dutse	50,000	king	09028463745	09082746352	QUEEN			\N
cd6a5921-ac9d-4726-aa78-21cdd14c91dd	\N	Sis61KwG9MM5xB3MOgxvakLrRDV2	09338475618	Alade	2024-10-10 00:00:00	09082637463	08093745362	2024-10-09T00:00:00.000Z	MALE	MARRIED	Financial advisor	Finance	Dutse	Gwagwalada	Abuja	Aso rock	Oyo	Dutse	50,000	king	09028463745	09082746352	QUEEN			\N
85acf31b-e780-4035-b86b-8fd614b9d3ea	\N	bkYnyvaNHfbah382iHG79N5OI9K2	33839292098	Ademola	2024-10-29 00:00:00	09037463576	08036456372	2024-11-04T00:00:00.000Z	FEMALE	MARRIED	Financial advisor	Finance	Dutse	Gwagwalada	Abuja	Aso rock	Wisconsin	Dutse	50,000	king	09028463745	09082746352	QUEEN	0838393839	Providus	https://res.cloudinary.com/dcysgnrdh/image/upload/v1730984201/kyc_images/f33c88aaxiibct67ars2.jpg
\.


--
-- Data for Name: MembersFinancialPosition; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."MembersFinancialPosition" (id, "memberId", surname, "firstName", "middleName", "dateOfEntry", telephone, "membersCapital", "ordinarySavings", "specialSavings", "membersLoan", "interestOnMembersLoan", "BOILoans", "grandTotal", "intOnLoanAccrued") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."Role" (id, name, "isGlobal", "memberId", "cooperativeId") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8d4d8906-d599-4878-b0d8-0c078d021d02	dc7e6f3bb7988819e7db4120a4623c7029ef71eb1ffb622409acfe7db43e96fd	2024-10-18 03:37:45.115146+00	20241018033744_init	\N	\N	2024-10-18 03:37:44.464395+00	1
393e6f0b-543f-4dc7-9b02-ec4433ff9dc4	fea2ed2472c34fdf91807354fbc9893b8f53b075579572aed75a3e6aaf81d7c6	2024-10-22 21:47:46.088962+00	20241022214745_init	\N	\N	2024-10-22 21:47:45.666341+00	1
66014d72-a8ed-4930-9f8d-746508920678	2840f633997d8d240f00af680a7ddc76a2912238f9733950d5fa68933aefe9d2	2024-10-18 14:02:20.298437+00	20241018140219_init	\N	\N	2024-10-18 14:02:19.80397+00	1
f1c9960d-354c-4e34-8b11-72634e758973	131ef1050e63ce9a602d80777243f508cd55b8ace331d3122f5f484310fd9db9	2024-10-18 14:04:51.957831+00	20241018140448_init	\N	\N	2024-10-18 14:04:50.249111+00	1
0d5e098f-f588-4bd5-83d3-c862f292e0df	be441b5199a3a30d9911b5d96eb2dcab293d056602774b8f708839c745d5a8d0	2024-10-18 14:08:32.701215+00	20241018140831_init	\N	\N	2024-10-18 14:08:31.938677+00	1
2ad3780d-30e9-4914-8661-482eaeac8213	49d6244b789667234e0db0941fffd65153bf01a46091f9d4f9bed8e142d7a566	2024-10-27 03:13:13.6226+00	20241027031312_init	\N	\N	2024-10-27 03:13:13.044847+00	1
3e32736e-7b23-42f7-ade6-2b3a6046214b	ddde396a3edcadc6657e0dc804a99ed36ecf27fa4ae3c4bff7e5419911910154	2024-10-18 14:15:13.998586+00	20241018141509_init	\N	\N	2024-10-18 14:15:10.055147+00	1
a05f3e2e-f9cd-4836-8fc5-f17be47496e3	398f7f3b724e8cb5a31ccfaa8da952b4baa26bb9ca49fba45e350b5981269627	2024-10-18 14:24:05.156354+00	20241018142402_init	\N	\N	2024-10-18 14:24:04.094075+00	1
c9a6f3d8-d14c-439d-94a5-01b80e669a54	131ef1050e63ce9a602d80777243f508cd55b8ace331d3122f5f484310fd9db9	2024-10-18 14:38:09.360552+00	20241018143808_init	\N	\N	2024-10-18 14:38:08.684664+00	1
95260c52-c350-46fb-a6e9-90c593270d69	0e217c0a28e1b78c137ef773e31ee776111f26db2f8770c2863213d821ee2353	2024-10-27 03:15:24.356034+00	20241027031523_init	\N	\N	2024-10-27 03:15:23.968007+00	1
28d597dc-c379-4a4d-b203-a6b806be4963	3824346cecbbbe63d5a75feb4f6333246ccba505d464273344a964a794f0282a	2024-10-18 14:40:30.391196+00	20241018144030_init	\N	\N	2024-10-18 14:40:30.341762+00	1
f0b5d3fb-caf4-4cef-ade9-d5c8feb889fd	757de589df2755ff537c8f0ee957dba4e336a22efe0de228bfdf2a7d099b46ac	2024-10-18 14:42:51.272118+00	20241018144238_init	\N	\N	2024-10-18 14:42:50.663544+00	1
f9b447e0-dbb7-4357-9ece-26a97ede2b7c	3422415e08ba7e80d08cb1e79ee1a349600ed1b4360566d249a1bbcfd34f689c	2024-10-18 14:46:12.764118+00	20241018144610_init	\N	\N	2024-10-18 14:46:12.344723+00	1
32884b2e-21e2-4c1a-826e-ffff33dafc49	801051b3c90c2a2857a484bb958c9194a7b7f3fe51d294e7538198eeab9e644b	2024-10-31 04:01:58.894683+00	20241031040155_init	\N	\N	2024-10-31 04:01:55.705113+00	1
d0b7e3b9-dbe2-4ec0-8b5c-da71e44c91fe	76ae43730dc876fba55ea55a561c46dee2ffe25bc52821d8c74dfcedfb0c9f3c	2024-10-18 14:48:54.993265+00	20241018144854_init	\N	\N	2024-10-18 14:48:54.885666+00	1
e43f12eb-9a76-4b98-b744-51fa2e9afd26	4c0fe1020d721ec3f6d309f79e3534506aeba01fbbfef40439149cae31eddd67	2024-10-18 14:50:21.032338+00	20241018145019_init	\N	\N	2024-10-18 14:50:20.351136+00	1
d759f922-4130-425e-9a2f-d9cf6039e9c3	7664e33a9f7ac67f2bdd646be2cda082a6a4bc86154ef4d8f8cd76bbded18fc7	2024-10-22 04:19:21.456355+00	20241022041921_init	\N	\N	2024-10-22 04:19:21.208109+00	1
3789c823-5d24-4ec0-83c1-05b2342464b3	2cb2caa8a4e0ee54d3972e7cd3118e4087c81ec0eb3bd28d5e3a3aac058ecdbb	2024-11-06 13:19:53.063525+00	20241106131952_init	\N	\N	2024-11-06 13:19:52.910001+00	1
402ccad6-8048-4d08-8187-bd7e926e277a	a747e276dba2e3022f22cc19e3b42ab7f966142ea3172e59a787bee1838a45b4	2024-10-22 04:22:35.114396+00	20241022042233_init	\N	\N	2024-10-22 04:22:34.445421+00	1
94e43f2f-f1de-43de-9965-8f5e1b52084d	32be7f83a1433adacaf64ac4c5e98622647206bfcc1bb378bba6d1f3ce9d6660	2024-11-06 15:18:04.187071+00	20241106151757_init	\N	\N	2024-11-06 15:18:02.58238+00	1
2c475025-e9d8-4bf8-81c6-f33bd5783e66	4c9f70c8c4ea5e25d12a7bb850b490f247ed047509245ba7499535b14e0c8638	2024-11-06 17:08:37.950728+00	20241106170606_init	\N	\N	2024-11-06 17:08:36.778685+00	1
58478775-77e8-416c-83eb-ae0e4a6abbfa	da7935acf65392496b56be8618ee18a1c58fb1c729a6955c3061637e39bd5f8b	2024-11-06 17:10:02.041715+00	20241106171000_latest_migration	\N	\N	2024-11-06 17:10:00.95006+00	1
\.


--
-- Data for Name: personalLedgers; Type: TABLE DATA; Schema: public; Owner: skynet
--

COPY public."personalLedgers" (id, "memberId", surname, "firstName", "middleName", "membersNo", telephone, date, "entranceFee", "shareCapital", "savingsDeposits", withdrawals, "savingsBalance", "loanRecieved", "loanRepayed", "loanBalance", "goodsAndServices", "paymentsMade", balance, "interestCharged", "interestPaid", "interestBalance") FROM stdin;
\.


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Cooperative Cooperative_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Cooperative"
    ADD CONSTRAINT "Cooperative_pkey" PRIMARY KEY (id);


--
-- Name: Debtor Debtor_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Debtor"
    ADD CONSTRAINT "Debtor_pkey" PRIMARY KEY (id);


--
-- Name: LoanInterestSetting LoanInterestSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoanInterestSetting"
    ADD CONSTRAINT "LoanInterestSetting_pkey" PRIMARY KEY (id);


--
-- Name: LoansApproved LoansApproved_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoansApproved"
    ADD CONSTRAINT "LoansApproved_pkey" PRIMARY KEY (id);


--
-- Name: LoansRequested LoansRequested_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoansRequested"
    ADD CONSTRAINT "LoansRequested_pkey" PRIMARY KEY (id);


--
-- Name: MemberSavings MemberSavings_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MemberSavings"
    ADD CONSTRAINT "MemberSavings_pkey" PRIMARY KEY (id);


--
-- Name: Member Member_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY (id);


--
-- Name: MembersDetails MembersDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MembersDetails"
    ADD CONSTRAINT "MembersDetails_pkey" PRIMARY KEY (id);


--
-- Name: MembersFinancialPosition MembersFinancialPosition_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MembersFinancialPosition"
    ADD CONSTRAINT "MembersFinancialPosition_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: personalLedgers personalLedgers_pkey; Type: CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."personalLedgers"
    ADD CONSTRAINT "personalLedgers_pkey" PRIMARY KEY (id);


--
-- Name: Admin_username_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "Admin_username_key" ON public."Admin" USING btree (username);


--
-- Name: CooperativeDetails_registrationNumber_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "CooperativeDetails_registrationNumber_key" ON public."CooperativeDetails" USING btree ("registrationNumber");


--
-- Name: Cooperative_cooperativeName_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "Cooperative_cooperativeName_key" ON public."Cooperative" USING btree ("cooperativeName");


--
-- Name: Cooperative_email_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "Cooperative_email_key" ON public."Cooperative" USING btree (email);


--
-- Name: Member_email_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "Member_email_key" ON public."Member" USING btree (email);


--
-- Name: MembersDetails_bvn_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "MembersDetails_bvn_key" ON public."MembersDetails" USING btree (bvn);


--
-- Name: MembersDetails_memberId_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "MembersDetails_memberId_key" ON public."MembersDetails" USING btree ("memberId");


--
-- Name: MembersDetails_telephone1_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "MembersDetails_telephone1_key" ON public."MembersDetails" USING btree (telephone1);


--
-- Name: MembersDetails_telephone2_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "MembersDetails_telephone2_key" ON public."MembersDetails" USING btree (telephone2);


--
-- Name: MembersFinancialPosition_memberId_key; Type: INDEX; Schema: public; Owner: skynet
--

CREATE UNIQUE INDEX "MembersFinancialPosition_memberId_key" ON public."MembersFinancialPosition" USING btree ("memberId");


--
-- Name: CooperativeDetails CooperativeDetails_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."CooperativeDetails"
    ADD CONSTRAINT "CooperativeDetails_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Debtor Debtor_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Debtor"
    ADD CONSTRAINT "Debtor_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Debtor Debtor_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Debtor"
    ADD CONSTRAINT "Debtor_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoanInterestSetting LoanInterestSetting_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoanInterestSetting"
    ADD CONSTRAINT "LoanInterestSetting_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoansApproved LoansApproved_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoansApproved"
    ADD CONSTRAINT "LoansApproved_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoansApproved LoansApproved_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoansApproved"
    ADD CONSTRAINT "LoansApproved_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoansRequested LoansRequested_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoansRequested"
    ADD CONSTRAINT "LoansRequested_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoansRequested LoansRequested_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."LoansRequested"
    ADD CONSTRAINT "LoansRequested_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MemberSavings MemberSavings_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MemberSavings"
    ADD CONSTRAINT "MemberSavings_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MemberSavings MemberSavings_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MemberSavings"
    ADD CONSTRAINT "MemberSavings_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Member Member_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MembersDetails MembersDetails_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MembersDetails"
    ADD CONSTRAINT "MembersDetails_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MembersFinancialPosition MembersFinancialPosition_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."MembersFinancialPosition"
    ADD CONSTRAINT "MembersFinancialPosition_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Role Role_cooperativeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_cooperativeId_fkey" FOREIGN KEY ("cooperativeId") REFERENCES public."Cooperative"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Role Role_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: personalLedgers personalLedgers_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: skynet
--

ALTER TABLE ONLY public."personalLedgers"
    ADD CONSTRAINT "personalLedgers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Member"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: skynet
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--


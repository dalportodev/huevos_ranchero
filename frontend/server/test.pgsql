--
-- PostgreSQL database dump
--

-- Dumped from database version 10.0
-- Dumped by pg_dump version 10.0

-- Started on 2017-11-07 21:03:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2810 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16451)
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE test (
);


ALTER TABLE test OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16404)
-- Name: userdata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE userdata (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    last_login text,
    last_ip text
);


ALTER TABLE userdata OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16402)
-- Name: userdata_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE userdata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userdata_id_seq OWNER TO postgres;

--
-- TOC entry 2811 (class 0 OID 0)
-- Dependencies: 196
-- Name: userdata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE userdata_id_seq OWNED BY userdata.id;


--
-- TOC entry 2675 (class 2604 OID 16436)
-- Name: userdata id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userdata ALTER COLUMN id SET DEFAULT nextval('userdata_id_seq'::regclass);


--
-- TOC entry 2803 (class 0 OID 16451)
-- Dependencies: 198
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY test  FROM stdin;
\.


--
-- TOC entry 2802 (class 0 OID 16404)
-- Dependencies: 197
-- Data for Name: userdata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY userdata (id, username, password, first_name, last_name, last_login, last_ip) FROM stdin;
1	rule	123	Roy	Vannakittikun	Mon Nov 06 2017 19:35:04 GMT-0800 (Pacific Standard Time)	::1
\.


--
-- TOC entry 2812 (class 0 OID 0)
-- Dependencies: 196
-- Name: userdata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('userdata_id_seq', 2, false);


--
-- TOC entry 2677 (class 2606 OID 16416)
-- Name: userdata constraintname; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userdata
    ADD CONSTRAINT constraintname UNIQUE (username);


--
-- TOC entry 2679 (class 2606 OID 16412)
-- Name: userdata userdata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userdata
    ADD CONSTRAINT userdata_pkey PRIMARY KEY (id);


-- Completed on 2017-11-07 21:04:03

--
-- PostgreSQL database dump complete
--


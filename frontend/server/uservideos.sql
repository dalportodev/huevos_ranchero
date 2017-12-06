--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.0

-- Started on 2017-12-01 19:25:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16398)
-- Name: uservideos; Type: TABLE; Schema: public; Owner: postgres
--


CREATE SEQUENCE uservideos_id_seq;

CREATE TABLE uservideos (
    id integer DEFAULT nextval('uservideos_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    date text NOT NULL,
    file_name text NOT NULL,
	status text DEFAULT 'Processing' NOT NULL
);


ALTER TABLE uservideos OWNER TO postgres;

--
-- TOC entry 2154 (class 0 OID 16398)
-- Dependencies: 198
-- Data for Name: uservideos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY uservideos (id, user_id, date, file_name) FROM stdin;
\.


--
-- TOC entry 2032 (class 2606 OID 16402)
-- Name: uservideos uservideos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY uservideos
    ADD CONSTRAINT uservideos_pkey PRIMARY KEY (id);


-- Completed on 2017-12-01 19:25:28

--
-- PostgreSQL database dump complete
--


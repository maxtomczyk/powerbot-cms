--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    login character varying(64) NOT NULL,
    password text NOT NULL,
    owner boolean DEFAULT false NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 6
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    friendly_name character varying(64) NOT NULL,
    description text,
    url text NOT NULL,
    force_update boolean DEFAULT true NOT NULL,
    attachment_id character varying(64)
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channels (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    "default" boolean DEFAULT false NOT NULL,
    label_id text,
    friendly_name character varying(64)
);


ALTER TABLE public.channels OWNER TO postgres;

--
-- Name: broadcast_channels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.broadcast_channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.broadcast_channels_id_seq OWNER TO postgres;

--
-- Name: broadcast_channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.broadcast_channels_id_seq OWNED BY public.channels.id;


--
-- Name: broadcasts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.broadcasts (
    id integer NOT NULL,
    broadcast_id text,
    channel_id integer NOT NULL,
    message_id integer NOT NULL,
    schedule_time timestamp without time zone,
    status character varying(32),
    creative_id text NOT NULL,
    range text
);


ALTER TABLE public.broadcasts OWNER TO postgres;

--
-- Name: broadcasts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.broadcasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.broadcasts_id_seq OWNER TO postgres;

--
-- Name: broadcasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.broadcasts_id_seq OWNED BY public.broadcasts.id;


--
-- Name: buttons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buttons (
    id integer NOT NULL,
    plug_id integer NOT NULL,
    text character varying(20) NOT NULL,
    language_id integer NOT NULL
);


ALTER TABLE public.buttons OWNER TO postgres;

--
-- Name: buttons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buttons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.buttons_id_seq OWNER TO postgres;

--
-- Name: buttons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buttons_id_seq OWNED BY public.buttons.id;


--
-- Name: buttons_plugs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buttons_plugs (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    friendly_name character varying(64) NOT NULL,
    text_plug integer NOT NULL
);


ALTER TABLE public.buttons_plugs OWNER TO postgres;

--
-- Name: buttons_plugs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buttons_plugs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.buttons_plugs_id_seq OWNER TO postgres;

--
-- Name: buttons_plugs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buttons_plugs_id_seq OWNED BY public.buttons_plugs.id;


--
-- Name: custom_postbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_postbacks (
    id integer NOT NULL,
    postback character varying(1000) NOT NULL,
    message_id integer NOT NULL,
    friendly_name character varying(64)
);


ALTER TABLE public.custom_postbacks OWNER TO postgres;

--
-- Name: custom_postbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_postbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.custom_postbacks_id_seq OWNER TO postgres;

--
-- Name: custom_postbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_postbacks_id_seq OWNED BY public.custom_postbacks.id;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    locale character varying(8) NOT NULL,
    "default" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.languages_id_seq OWNER TO postgres;

--
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    friendly_name character varying(64),
    json json NOT NULL,
    group_id integer,
    description character varying(64)
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: plugs_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plugs_groups (
    id integer NOT NULL,
    name character varying(64) NOT NULL
);


ALTER TABLE public.plugs_groups OWNER TO postgres;

--
-- Name: plugs_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plugs_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plugs_groups_id_seq OWNER TO postgres;

--
-- Name: plugs_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plugs_groups_id_seq OWNED BY public.plugs_groups.id;


--
-- Name: regex_reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regex_reactions (
    id integer NOT NULL,
    regex_body text NOT NULL,
    message_id integer NOT NULL,
    regex_flags character varying(16),
    friendly_name character varying(64)
);


ALTER TABLE public.regex_reactions OWNER TO postgres;

--
-- Name: regex_reactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.regex_reactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.regex_reactions_id_seq OWNER TO postgres;

--
-- Name: regex_reactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.regex_reactions_id_seq OWNED BY public.regex_reactions.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    value character varying(128) DEFAULT false NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: static_elements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.static_elements (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    value text,
    json json
);


ALTER TABLE public.static_elements OWNER TO postgres;

--
-- Name: static_elements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.static_elements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.static_elements_id_seq OWNER TO postgres;

--
-- Name: static_elements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.static_elements_id_seq OWNED BY public.static_elements.id;


--
-- Name: texts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.texts (
    id integer NOT NULL,
    plug_id integer NOT NULL,
    text character varying(640) NOT NULL,
    language_id integer NOT NULL
);


ALTER TABLE public.texts OWNER TO postgres;

--
-- Name: texts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.texts_id_seq OWNER TO postgres;

--
-- Name: texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.texts_id_seq OWNED BY public.texts.id;


--
-- Name: texts_plugs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.texts_plugs (
    id integer NOT NULL,
    description text,
    name character varying(32) NOT NULL,
    friendly_name character varying(32) NOT NULL,
    "group" integer NOT NULL
);


ALTER TABLE public.texts_plugs OWNER TO postgres;

--
-- Name: texts_plugs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.texts_plugs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.texts_plugs_id_seq OWNER TO postgres;

--
-- Name: texts_plugs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.texts_plugs_id_seq OWNED BY public.texts_plugs.id;


--
-- Name: unknown_words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unknown_words (
    id integer NOT NULL,
    word text NOT NULL,
    occurrences bigint DEFAULT 1 NOT NULL
);


ALTER TABLE public.unknown_words OWNER TO postgres;

--
-- Name: unknown_words_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unknown_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unknown_words_id_seq OWNER TO postgres;

--
-- Name: unknown_words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unknown_words_id_seq OWNED BY public.unknown_words.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(64),
    last_name character varying(64),
    locale character varying(8),
    messenger_id character varying(64) NOT NULL,
    gender character varying(6),
    moderator_chat boolean DEFAULT false,
    bot_lock boolean DEFAULT false NOT NULL,
    waiting_for_reason boolean DEFAULT false NOT NULL,
    chat_reason character varying(640)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_channels (
    id integer NOT NULL,
    user_id integer NOT NULL,
    channel_id integer NOT NULL
);


ALTER TABLE public.users_channels OWNER TO postgres;

--
-- Name: users_channels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_channels_id_seq OWNER TO postgres;

--
-- Name: users_channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_channels_id_seq OWNED BY public.users_channels.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- Name: broadcasts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broadcasts ALTER COLUMN id SET DEFAULT nextval('public.broadcasts_id_seq'::regclass);


--
-- Name: buttons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons ALTER COLUMN id SET DEFAULT nextval('public.buttons_id_seq'::regclass);


--
-- Name: buttons_plugs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons_plugs ALTER COLUMN id SET DEFAULT nextval('public.buttons_plugs_id_seq'::regclass);


--
-- Name: channels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.broadcast_channels_id_seq'::regclass);


--
-- Name: custom_postbacks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_postbacks ALTER COLUMN id SET DEFAULT nextval('public.custom_postbacks_id_seq'::regclass);


--
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: plugs_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plugs_groups ALTER COLUMN id SET DEFAULT nextval('public.plugs_groups_id_seq'::regclass);


--
-- Name: regex_reactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regex_reactions ALTER COLUMN id SET DEFAULT nextval('public.regex_reactions_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: static_elements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.static_elements ALTER COLUMN id SET DEFAULT nextval('public.static_elements_id_seq'::regclass);


--
-- Name: texts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts ALTER COLUMN id SET DEFAULT nextval('public.texts_id_seq'::regclass);


--
-- Name: texts_plugs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts_plugs ALTER COLUMN id SET DEFAULT nextval('public.texts_plugs_id_seq'::regclass);


--
-- Name: unknown_words id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unknown_words ALTER COLUMN id SET DEFAULT nextval('public.unknown_words_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_channels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_channels ALTER COLUMN id SET DEFAULT nextval('public.users_channels_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, name, login, password, owner) FROM stdin;
1	Bot Owner	owner	$argon2i$v=19$m=4096,t=1,p=1$c29tZXNhbHQ$Q9zntiU3SaKoZ/8zc4I2gksMx3Y6wUzeHK8ygWcoaMQ	f
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (id, name, friendly_name, description, url, force_update, attachment_id) FROM stdin;
\.


--
-- Data for Name: broadcasts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.broadcasts (id, broadcast_id, channel_id, message_id, schedule_time, status, creative_id, range) FROM stdin;
\.


--
-- Data for Name: buttons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buttons (id, plug_id, text, language_id) FROM stdin;
3	3	Remove my data ❌	1
4	4	Stay with us ❤️	1
2	2	Yes 💬	1
1	1	Cancel ❌	1
5	5	Menu	1
6	7	Menu	1
7	8	Menu	1
8	9	Restart	1
\.


--
-- Data for Name: buttons_plugs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buttons_plugs (id, name, friendly_name, text_plug) FROM stdin;
1	chat_cancel	Accept	2
2	chat_accept	Cancel	2
3	data_remove	Remove	6
4	data_remove_cancel	Cancel	6
5	chat_reason_given	Back to menu	9
7	back_to_menu_1	Back to menu	5
8	back_to_menu_2	Back to menu	7
9	restart	Restart	8
\.


--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.channels (id, name, "default", label_id, friendly_name) FROM stdin;
1	incredbot_default	t		Incredbot CMS Channel
\.


--
-- Data for Name: custom_postbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_postbacks (id, postback, message_id, friendly_name) FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (id, name, locale, "default") FROM stdin;
1	English	en_US	t
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, name, friendly_name, json, group_id, description) FROM stdin;
1	unknown	Unknown text message	{ "text": "This is unknown message reaction. You can change it in database or CMS panel. :D", "quick_replies": [{"content_type": "text", "payload": "GOT_IT", "title":"Got it!"}] }\r\n	4	Reply to non-command message
\.


--
-- Data for Name: plugs_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plugs_groups (id, name) FROM stdin;
1	Basic
2	Moderator Chat
\.


--
-- Data for Name: regex_reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regex_reactions (id, regex_body, message_id, regex_flags, friendly_name) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, name, value) FROM stdin;
3	channels_sync_check	false
2	channels_check	false
1	force_update_statics	false
\.


--
-- Data for Name: static_elements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.static_elements (id, name, value, json) FROM stdin;
3	hello	Hello, it's default hello message of Incredbot CMS	\N
2	get_started_payload	GET_STARTED	\N
1	menu	\N	{\r\n    "persistent_menu": [{\r\n        "locale": "default",\r\n        "call_to_actions": [{\r\n            "title": "Contact",\r\n            "type": "postback",\r\n            "payload": "CONTACT"\r\n        }, {\r\n            "title": "Settings",\r\n            "type": "nested",\r\n            "call_to_actions": [{\r\n                "title": "Remove my data",\r\n                "type": "postback",\r\n                "payload": "CLEAR_USER_DATA"\r\n            }]\r\n        }, {\r\n            "title": "Powered by Incredbot",\r\n            "type": "postback",\r\n            "payload": "CONTACT"\r\n        }]\r\n    }]\r\n}\r\n
\.


--
-- Data for Name: texts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.texts (id, plug_id, text, language_id) FROM stdin;
1	1	Hello!	1
2	2	You are about to start chat with moderator, are you sure?	1
4	4	Chat with moderator has been ended. Bot is active again!	1
5	5	Chat with moderator has been canelled.	1
6	6	Are you sure that you want to remove all your data?	1
7	7	Data removal has been canceled.	1
8	8	Your data has been removed from database!	1
3	3	You are now in queue to chat with moderator. Write your question now, so moderator will be able to answer even if you are not online. Important - Your question must be in a single message!	1
9	9	Great! You will be notified when moderator investigate your question your question!	1
\.


--
-- Data for Name: texts_plugs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.texts_plugs (id, description, name, friendly_name, "group") FROM stdin;
1	Bot response for any text message	hello	Hello message	1
5	Moderator chat canceled message	moderator_chat_canceled	Moderator Chat - Canceled	2
2	Moderator chat question	moderator_chat	Moderator Chat	2
3	Moderator chat started message	moderator_chat_started	Moderator Chat - Start	2
4	Moderator chat finished message	moderator_chat_ended	Moderator Chat - Finished	2
6	Message with question about user data remove	user_data_remove	User remove - Question	1
7	Data of user not removed from database	user_data_remove_canceled	User remove - Canceled	1
8	Data of user removed from bot	user_data_removed	User remove - Done	1
9	Moderator chat reason given	chat_reason_added	Moderator chat - Reason	2
\.


--
-- Data for Name: unknown_words; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unknown_words (id, word, occurrences) FROM stdin;
1	gk	1
2	jbk	1
4	kj	1
5	blah	2
6	asdf	1
3	asd	3
7	asdasd	1
8	sad	1
9	jhvvhjjvb	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, locale, messenger_id, gender, moderator_chat, bot_lock, waiting_for_reason, chat_reason) FROM stdin;
\.


--
-- Data for Name: users_channels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_channels (id, user_id, channel_id) FROM stdin;
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_id_seq', 1, false);


--
-- Name: broadcast_channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.broadcast_channels_id_seq', 1, true);


--
-- Name: broadcasts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.broadcasts_id_seq', 1, false);


--
-- Name: buttons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buttons_id_seq', 8, true);


--
-- Name: buttons_plugs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buttons_plugs_id_seq', 9, true);


--
-- Name: custom_postbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.custom_postbacks_id_seq', 1, false);


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.languages_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 2, false);


--
-- Name: plugs_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plugs_groups_id_seq', 2, false);


--
-- Name: regex_reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.regex_reactions_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 3, true);


--
-- Name: static_elements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.static_elements_id_seq', 3, true);


--
-- Name: texts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.texts_id_seq', 9, true);


--
-- Name: texts_plugs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.texts_plugs_id_seq', 9, true);


--
-- Name: unknown_words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unknown_words_id_seq', 9, true);


--
-- Name: users_channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_channels_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: channels broadcast_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT broadcast_channels_pkey PRIMARY KEY (id);


--
-- Name: broadcasts broadcasts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broadcasts
    ADD CONSTRAINT broadcasts_pkey PRIMARY KEY (id);


--
-- Name: buttons buttons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons
    ADD CONSTRAINT buttons_pkey PRIMARY KEY (id);


--
-- Name: buttons_plugs buttons_plugs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons_plugs
    ADD CONSTRAINT buttons_plugs_pkey PRIMARY KEY (id);


--
-- Name: custom_postbacks custom_postbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_postbacks
    ADD CONSTRAINT custom_postbacks_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: plugs_groups plugs_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plugs_groups
    ADD CONSTRAINT plugs_groups_pkey PRIMARY KEY (id);


--
-- Name: regex_reactions regex_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regex_reactions
    ADD CONSTRAINT regex_reactions_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: static_elements static_elements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.static_elements
    ADD CONSTRAINT static_elements_pkey PRIMARY KEY (id);


--
-- Name: texts texts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);


--
-- Name: texts_plugs texts_plugs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts_plugs
    ADD CONSTRAINT texts_plugs_pkey PRIMARY KEY (id);


--
-- Name: unknown_words unknown_words_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unknown_words
    ADD CONSTRAINT unknown_words_pkey PRIMARY KEY (id);


--
-- Name: users_channels users_channels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_channels
    ADD CONSTRAINT users_channels_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admins_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_id_uindex ON public.admins USING btree (id);


--
-- Name: admins_login_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_login_uindex ON public.admins USING btree (login);


--
-- Name: attachments_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX attachments_id_uindex ON public.attachments USING btree (id);


--
-- Name: attachments_name_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX attachments_name_uindex ON public.attachments USING btree (name);


--
-- Name: broadcast_channels_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX broadcast_channels_id_uindex ON public.channels USING btree (id);


--
-- Name: broadcasts_fb_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX broadcasts_fb_id_uindex ON public.broadcasts USING btree (broadcast_id);


--
-- Name: broadcasts_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX broadcasts_id_uindex ON public.broadcasts USING btree (id);


--
-- Name: buttons_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX buttons_id_uindex ON public.buttons USING btree (id);


--
-- Name: buttons_plugs_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX buttons_plugs_id_uindex ON public.buttons_plugs USING btree (id);


--
-- Name: buttons_plugs_name_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX buttons_plugs_name_uindex ON public.buttons_plugs USING btree (name);


--
-- Name: custom_postbacks_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX custom_postbacks_id_uindex ON public.custom_postbacks USING btree (id);


--
-- Name: custom_postbacks_postback_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX custom_postbacks_postback_uindex ON public.custom_postbacks USING btree (postback);


--
-- Name: languages_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX languages_id_uindex ON public.languages USING btree (id);


--
-- Name: languages_locale_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX languages_locale_uindex ON public.languages USING btree (locale);


--
-- Name: messages_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX messages_id_uindex ON public.messages USING btree (id);


--
-- Name: messages_name_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX messages_name_uindex ON public.messages USING btree (name);


--
-- Name: plugs_groups_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX plugs_groups_id_uindex ON public.plugs_groups USING btree (id);


--
-- Name: regex_reactions_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX regex_reactions_id_uindex ON public.regex_reactions USING btree (id);


--
-- Name: settings_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX settings_id_uindex ON public.settings USING btree (id);


--
-- Name: settings_name_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX settings_name_uindex ON public.settings USING btree (name);


--
-- Name: static_elements_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX static_elements_id_uindex ON public.static_elements USING btree (id);


--
-- Name: texts_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX texts_id_uindex ON public.texts USING btree (id);


--
-- Name: texts_plugs_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX texts_plugs_id_uindex ON public.texts_plugs USING btree (id);


--
-- Name: texts_plugs_name_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX texts_plugs_name_uindex ON public.texts_plugs USING btree (name);


--
-- Name: unknown_words_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unknown_words_id_uindex ON public.unknown_words USING btree (id);


--
-- Name: unknown_words_word_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unknown_words_word_uindex ON public.unknown_words USING btree (word);


--
-- Name: users_channels_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_channels_id_uindex ON public.users_channels USING btree (id);


--
-- Name: users_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_id_uindex ON public.users USING btree (id);


--
-- Name: broadcasts broadcasts_channels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broadcasts
    ADD CONSTRAINT broadcasts_channels_id_fk FOREIGN KEY (channel_id) REFERENCES public.channels(id);


--
-- Name: broadcasts broadcasts_messages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.broadcasts
    ADD CONSTRAINT broadcasts_messages_id_fk FOREIGN KEY (message_id) REFERENCES public.messages(id);


--
-- Name: buttons buttons_buttons_plugs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons
    ADD CONSTRAINT buttons_buttons_plugs_id_fk FOREIGN KEY (plug_id) REFERENCES public.buttons_plugs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: buttons buttons_languages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons
    ADD CONSTRAINT buttons_languages_id_fk FOREIGN KEY (language_id) REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: buttons_plugs buttons_plugs_texts_plugs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttons_plugs
    ADD CONSTRAINT buttons_plugs_texts_plugs_id_fk FOREIGN KEY (text_plug) REFERENCES public.texts_plugs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: custom_postbacks custom_postbacks_messages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_postbacks
    ADD CONSTRAINT custom_postbacks_messages_id_fk FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: regex_reactions regex_reactions_messages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regex_reactions
    ADD CONSTRAINT regex_reactions_messages_id_fk FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE;


--
-- Name: texts texts_languages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_languages_id_fk FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: texts_plugs texts_plugs_plugs_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts_plugs
    ADD CONSTRAINT texts_plugs_plugs_groups_id_fk FOREIGN KEY ("group") REFERENCES public.plugs_groups(id);


--
-- Name: texts texts_texts_plugs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_texts_plugs_id_fk FOREIGN KEY (plug_id) REFERENCES public.texts_plugs(id);


--
-- Name: users_channels users_channels_broadcast_channels_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_channels
    ADD CONSTRAINT users_channels_broadcast_channels_id_fk FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_channels users_channels_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_channels
    ADD CONSTRAINT users_channels_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


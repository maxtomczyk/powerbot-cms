PGDMP     5                	    v           incredbot_starter    10.4    10.4 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            �           1262    16607    incredbot_starter    DATABASE     �   CREATE DATABASE incredbot_starter WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Polish_Poland.1250' LC_CTYPE = 'Polish_Poland.1250';
 !   DROP DATABASE incredbot_starter;
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    3                        3079    12924    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            �           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16652    admins    TABLE     �   CREATE TABLE public.admins (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    login character varying(64) NOT NULL,
    password text NOT NULL,
    owner boolean DEFAULT false NOT NULL
);
    DROP TABLE public.admins;
       public         postgres    false    3            �            1259    16659    admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 6
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.admins_id_seq;
       public       postgres    false    3    196            �           0    0    admins_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;
            public       postgres    false    197            �            1259    21128    attachments    TABLE       CREATE TABLE public.attachments (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    friendly_name character varying(64) NOT NULL,
    description text,
    url text NOT NULL,
    force_update boolean DEFAULT true NOT NULL,
    attachment_id character varying(64)
);
    DROP TABLE public.attachments;
       public         postgres    false    3            �            1259    21126    attachments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.attachments_id_seq;
       public       postgres    false    211    3            �           0    0    attachments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;
            public       postgres    false    210            �            1259    48947    channels    TABLE     �   CREATE TABLE public.channels (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    "default" boolean DEFAULT false NOT NULL,
    label_id text,
    friendly_name character varying(64)
);
    DROP TABLE public.channels;
       public         postgres    false    3            �            1259    48945    broadcast_channels_id_seq    SEQUENCE     �   CREATE SEQUENCE public.broadcast_channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.broadcast_channels_id_seq;
       public       postgres    false    3    217            �           0    0    broadcast_channels_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.broadcast_channels_id_seq OWNED BY public.channels.id;
            public       postgres    false    216            �            1259    49074 
   broadcasts    TABLE       CREATE TABLE public.broadcasts (
    id integer NOT NULL,
    broadcast_id text,
    channel_id integer NOT NULL,
    message_id integer NOT NULL,
    schedule_time timestamp without time zone,
    status character varying(32),
    creative_id text NOT NULL,
    range text
);
    DROP TABLE public.broadcasts;
       public         postgres    false    3            �            1259    49071    broadcasts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.broadcasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.broadcasts_id_seq;
       public       postgres    false    229    3            �           0    0    broadcasts_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.broadcasts_id_seq OWNED BY public.broadcasts.id;
            public       postgres    false    228            �            1259    48919    buttons    TABLE     �   CREATE TABLE public.buttons (
    id integer NOT NULL,
    plug_id integer NOT NULL,
    text character varying(20) NOT NULL,
    language_id integer NOT NULL
);
    DROP TABLE public.buttons;
       public         postgres    false    3            �            1259    48917    buttons_id_seq    SEQUENCE     �   CREATE SEQUENCE public.buttons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.buttons_id_seq;
       public       postgres    false    215    3            �           0    0    buttons_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.buttons_id_seq OWNED BY public.buttons.id;
            public       postgres    false    214            �            1259    48904    buttons_plugs    TABLE     �   CREATE TABLE public.buttons_plugs (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    friendly_name character varying(64) NOT NULL,
    text_plug integer NOT NULL
);
 !   DROP TABLE public.buttons_plugs;
       public         postgres    false    3            �            1259    48902    buttons_plugs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.buttons_plugs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.buttons_plugs_id_seq;
       public       postgres    false    213    3            �           0    0    buttons_plugs_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.buttons_plugs_id_seq OWNED BY public.buttons_plugs.id;
            public       postgres    false    212            �            1259    49038    custom_postbacks    TABLE     �   CREATE TABLE public.custom_postbacks (
    id integer NOT NULL,
    postback character varying(1000) NOT NULL,
    message_id integer NOT NULL,
    friendly_name character varying(64)
);
 $   DROP TABLE public.custom_postbacks;
       public         postgres    false    3            �            1259    49036    custom_postbacks_id_seq    SEQUENCE     �   CREATE SEQUENCE public.custom_postbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.custom_postbacks_id_seq;
       public       postgres    false    3    227            �           0    0    custom_postbacks_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.custom_postbacks_id_seq OWNED BY public.custom_postbacks.id;
            public       postgres    false    226            �            1259    16722 	   languages    TABLE     �   CREATE TABLE public.languages (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    locale character varying(8) NOT NULL,
    "default" boolean DEFAULT false NOT NULL
);
    DROP TABLE public.languages;
       public         postgres    false    3            �            1259    16720    languages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.languages_id_seq;
       public       postgres    false    205    3            �           0    0    languages_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;
            public       postgres    false    204            �            1259    48999    messages    TABLE     �   CREATE TABLE public.messages (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    friendly_name character varying(64),
    json json NOT NULL,
    group_id integer,
    description character varying(64)
);
    DROP TABLE public.messages;
       public         postgres    false    3            �            1259    48997    messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.messages_id_seq;
       public       postgres    false    3    223            �           0    0    messages_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;
            public       postgres    false    222            �            1259    16698    plugs_groups    TABLE     g   CREATE TABLE public.plugs_groups (
    id integer NOT NULL,
    name character varying(64) NOT NULL
);
     DROP TABLE public.plugs_groups;
       public         postgres    false    3            �            1259    16696    plugs_groups_id_seq    SEQUENCE     �   CREATE SEQUENCE public.plugs_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.plugs_groups_id_seq;
       public       postgres    false    203    3            �           0    0    plugs_groups_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.plugs_groups_id_seq OWNED BY public.plugs_groups.id;
            public       postgres    false    202            �            1259    48987    regex_reactions    TABLE     �   CREATE TABLE public.regex_reactions (
    id integer NOT NULL,
    regex_body text NOT NULL,
    message_id integer NOT NULL,
    regex_flags character varying(16),
    friendly_name character varying(64)
);
 #   DROP TABLE public.regex_reactions;
       public         postgres    false    3            �            1259    48985    regex_reactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.regex_reactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.regex_reactions_id_seq;
       public       postgres    false    3    221            �           0    0    regex_reactions_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.regex_reactions_id_seq OWNED BY public.regex_reactions.id;
            public       postgres    false    220            �            1259    21117    settings    TABLE     �   CREATE TABLE public.settings (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    value character varying(128) DEFAULT false NOT NULL
);
    DROP TABLE public.settings;
       public         postgres    false    3            �            1259    21115    settings_id_seq    SEQUENCE     �   CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.settings_id_seq;
       public       postgres    false    3    209            �           0    0    settings_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;
            public       postgres    false    208            �            1259    49104    static_elements    TABLE     �   CREATE TABLE public.static_elements (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    value text,
    json json
);
 #   DROP TABLE public.static_elements;
       public         postgres    false    3            �            1259    49102    static_elements_id_seq    SEQUENCE     �   CREATE SEQUENCE public.static_elements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.static_elements_id_seq;
       public       postgres    false    3    231            �           0    0    static_elements_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.static_elements_id_seq OWNED BY public.static_elements.id;
            public       postgres    false    230            �            1259    16661    texts    TABLE     �   CREATE TABLE public.texts (
    id integer NOT NULL,
    plug_id integer NOT NULL,
    text character varying(640) NOT NULL,
    language_id integer NOT NULL
);
    DROP TABLE public.texts;
       public         postgres    false    3            �            1259    16667    texts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.texts_id_seq;
       public       postgres    false    198    3            �           0    0    texts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.texts_id_seq OWNED BY public.texts.id;
            public       postgres    false    199            �            1259    16669    texts_plugs    TABLE     �   CREATE TABLE public.texts_plugs (
    id integer NOT NULL,
    description text,
    name character varying(32) NOT NULL,
    friendly_name character varying(32) NOT NULL,
    "group" integer NOT NULL
);
    DROP TABLE public.texts_plugs;
       public         postgres    false    3            �            1259    16675    texts_plugs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.texts_plugs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.texts_plugs_id_seq;
       public       postgres    false    200    3            �           0    0    texts_plugs_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.texts_plugs_id_seq OWNED BY public.texts_plugs.id;
            public       postgres    false    201            �            1259    49017    unknown_words    TABLE     �   CREATE TABLE public.unknown_words (
    id integer NOT NULL,
    word text NOT NULL,
    occurrences bigint DEFAULT 1 NOT NULL
);
 !   DROP TABLE public.unknown_words;
       public         postgres    false    3            �            1259    49015    unknown_words_id_seq    SEQUENCE     �   CREATE SEQUENCE public.unknown_words_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.unknown_words_id_seq;
       public       postgres    false    3    225            �           0    0    unknown_words_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.unknown_words_id_seq OWNED BY public.unknown_words.id;
            public       postgres    false    224            �            1259    21087    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(64),
    last_name character varying(64),
    locale character varying(8),
    messenger_id character varying(64) NOT NULL,
    gender character varying(6),
    moderator_chat boolean DEFAULT false
);
    DROP TABLE public.users;
       public         postgres    false    3            �            1259    48957    users_channels    TABLE        CREATE TABLE public.users_channels (
    id integer NOT NULL,
    user_id integer NOT NULL,
    channel_id integer NOT NULL
);
 "   DROP TABLE public.users_channels;
       public         postgres    false    3            �            1259    48955    users_channels_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.users_channels_id_seq;
       public       postgres    false    3    219            �           0    0    users_channels_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.users_channels_id_seq OWNED BY public.users_channels.id;
            public       postgres    false    218            �            1259    21085    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       postgres    false    3    207            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
            public       postgres    false    206            �
           2604    16677 	   admins id    DEFAULT     f   ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);
 8   ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    197    196            �
           2604    21131    attachments id    DEFAULT     p   ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);
 =   ALTER TABLE public.attachments ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    210    211    211            �
           2604    49077    broadcasts id    DEFAULT     n   ALTER TABLE ONLY public.broadcasts ALTER COLUMN id SET DEFAULT nextval('public.broadcasts_id_seq'::regclass);
 <   ALTER TABLE public.broadcasts ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    228    229    229            �
           2604    48922 
   buttons id    DEFAULT     h   ALTER TABLE ONLY public.buttons ALTER COLUMN id SET DEFAULT nextval('public.buttons_id_seq'::regclass);
 9   ALTER TABLE public.buttons ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    214    215    215            �
           2604    48907    buttons_plugs id    DEFAULT     t   ALTER TABLE ONLY public.buttons_plugs ALTER COLUMN id SET DEFAULT nextval('public.buttons_plugs_id_seq'::regclass);
 ?   ALTER TABLE public.buttons_plugs ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    213    212    213            �
           2604    48950    channels id    DEFAULT     t   ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.broadcast_channels_id_seq'::regclass);
 :   ALTER TABLE public.channels ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    217    216    217            �
           2604    49041    custom_postbacks id    DEFAULT     z   ALTER TABLE ONLY public.custom_postbacks ALTER COLUMN id SET DEFAULT nextval('public.custom_postbacks_id_seq'::regclass);
 B   ALTER TABLE public.custom_postbacks ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    226    227    227            �
           2604    16725    languages id    DEFAULT     l   ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);
 ;   ALTER TABLE public.languages ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    204    205    205            �
           2604    49002    messages id    DEFAULT     j   ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);
 :   ALTER TABLE public.messages ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    222    223    223            �
           2604    16701    plugs_groups id    DEFAULT     r   ALTER TABLE ONLY public.plugs_groups ALTER COLUMN id SET DEFAULT nextval('public.plugs_groups_id_seq'::regclass);
 >   ALTER TABLE public.plugs_groups ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    203    202    203            �
           2604    48990    regex_reactions id    DEFAULT     x   ALTER TABLE ONLY public.regex_reactions ALTER COLUMN id SET DEFAULT nextval('public.regex_reactions_id_seq'::regclass);
 A   ALTER TABLE public.regex_reactions ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    220    221    221            �
           2604    21120    settings id    DEFAULT     j   ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);
 :   ALTER TABLE public.settings ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    208    209    209            �
           2604    49107    static_elements id    DEFAULT     x   ALTER TABLE ONLY public.static_elements ALTER COLUMN id SET DEFAULT nextval('public.static_elements_id_seq'::regclass);
 A   ALTER TABLE public.static_elements ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    231    230    231            �
           2604    16678    texts id    DEFAULT     d   ALTER TABLE ONLY public.texts ALTER COLUMN id SET DEFAULT nextval('public.texts_id_seq'::regclass);
 7   ALTER TABLE public.texts ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    199    198            �
           2604    16679    texts_plugs id    DEFAULT     p   ALTER TABLE ONLY public.texts_plugs ALTER COLUMN id SET DEFAULT nextval('public.texts_plugs_id_seq'::regclass);
 =   ALTER TABLE public.texts_plugs ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    201    200            �
           2604    49020    unknown_words id    DEFAULT     t   ALTER TABLE ONLY public.unknown_words ALTER COLUMN id SET DEFAULT nextval('public.unknown_words_id_seq'::regclass);
 ?   ALTER TABLE public.unknown_words ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    225    224    225            �
           2604    21090    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    207    206    207            �
           2604    48960    users_channels id    DEFAULT     v   ALTER TABLE ONLY public.users_channels ALTER COLUMN id SET DEFAULT nextval('public.users_channels_id_seq'::regclass);
 @   ALTER TABLE public.users_channels ALTER COLUMN id DROP DEFAULT;
       public       postgres    false    218    219    219            �          0    16652    admins 
   TABLE DATA                     public       postgres    false    196   %�       �          0    21128    attachments 
   TABLE DATA                     public       postgres    false    211   �       �          0    49074 
   broadcasts 
   TABLE DATA                     public       postgres    false    229   �       �          0    48919    buttons 
   TABLE DATA                     public       postgres    false    215   �       �          0    48904    buttons_plugs 
   TABLE DATA                     public       postgres    false    213   Ӿ       �          0    48947    channels 
   TABLE DATA                     public       postgres    false    217   ��       �          0    49038    custom_postbacks 
   TABLE DATA                     public       postgres    false    227   �       �          0    16722 	   languages 
   TABLE DATA                     public       postgres    false    205   1�       �          0    48999    messages 
   TABLE DATA                     public       postgres    false    223   ��       �          0    16698    plugs_groups 
   TABLE DATA                     public       postgres    false    203   ��       �          0    48987    regex_reactions 
   TABLE DATA                     public       postgres    false    221   0�       �          0    21117    settings 
   TABLE DATA                     public       postgres    false    209   J�       �          0    49104    static_elements 
   TABLE DATA                     public       postgres    false    231   ��       �          0    16661    texts 
   TABLE DATA                     public       postgres    false    198   P�       �          0    16669    texts_plugs 
   TABLE DATA                     public       postgres    false    200   ��       �          0    49017    unknown_words 
   TABLE DATA                     public       postgres    false    225   ��       �          0    21087    users 
   TABLE DATA                     public       postgres    false    207   �       �          0    48957    users_channels 
   TABLE DATA                     public       postgres    false    219   +�       �           0    0    admins_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.admins_id_seq', 1, true);
            public       postgres    false    197            �           0    0    attachments_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.attachments_id_seq', 1, false);
            public       postgres    false    210            �           0    0    broadcast_channels_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.broadcast_channels_id_seq', 1, true);
            public       postgres    false    216            �           0    0    broadcasts_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.broadcasts_id_seq', 1, false);
            public       postgres    false    228            �           0    0    buttons_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.buttons_id_seq', 4, true);
            public       postgres    false    214                        0    0    buttons_plugs_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.buttons_plugs_id_seq', 4, true);
            public       postgres    false    212                       0    0    custom_postbacks_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.custom_postbacks_id_seq', 1, false);
            public       postgres    false    226                       0    0    languages_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.languages_id_seq', 1, true);
            public       postgres    false    204                       0    0    messages_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.messages_id_seq', 2, false);
            public       postgres    false    222                       0    0    plugs_groups_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.plugs_groups_id_seq', 2, false);
            public       postgres    false    202                       0    0    regex_reactions_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.regex_reactions_id_seq', 1, false);
            public       postgres    false    220                       0    0    settings_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.settings_id_seq', 3, true);
            public       postgres    false    208                       0    0    static_elements_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.static_elements_id_seq', 3, true);
            public       postgres    false    230                       0    0    texts_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.texts_id_seq', 8, true);
            public       postgres    false    199            	           0    0    texts_plugs_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.texts_plugs_id_seq', 8, true);
            public       postgres    false    201            
           0    0    unknown_words_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.unknown_words_id_seq', 1, false);
            public       postgres    false    224                       0    0    users_channels_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.users_channels_id_seq', 1, false);
            public       postgres    false    218                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
            public       postgres    false    206            �
           2606    16681    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public         postgres    false    196                       2606    21137    attachments attachments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_pkey;
       public         postgres    false    211                       2606    48953     channels broadcast_channels_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.channels
    ADD CONSTRAINT broadcast_channels_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.channels DROP CONSTRAINT broadcast_channels_pkey;
       public         postgres    false    217            4           2606    49082    broadcasts broadcasts_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.broadcasts
    ADD CONSTRAINT broadcasts_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.broadcasts DROP CONSTRAINT broadcasts_pkey;
       public         postgres    false    229                       2606    48924    buttons buttons_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.buttons
    ADD CONSTRAINT buttons_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.buttons DROP CONSTRAINT buttons_pkey;
       public         postgres    false    215                       2606    48909     buttons_plugs buttons_plugs_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.buttons_plugs
    ADD CONSTRAINT buttons_plugs_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.buttons_plugs DROP CONSTRAINT buttons_plugs_pkey;
       public         postgres    false    213            /           2606    49046 &   custom_postbacks custom_postbacks_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.custom_postbacks
    ADD CONSTRAINT custom_postbacks_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.custom_postbacks DROP CONSTRAINT custom_postbacks_pkey;
       public         postgres    false    227            	           2606    16727    languages languages_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.languages DROP CONSTRAINT languages_pkey;
       public         postgres    false    205            (           2606    49007    messages messages_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public         postgres    false    223                       2606    16703    plugs_groups plugs_groups_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.plugs_groups
    ADD CONSTRAINT plugs_groups_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.plugs_groups DROP CONSTRAINT plugs_groups_pkey;
       public         postgres    false    203            $           2606    48995 $   regex_reactions regex_reactions_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.regex_reactions
    ADD CONSTRAINT regex_reactions_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.regex_reactions DROP CONSTRAINT regex_reactions_pkey;
       public         postgres    false    221                       2606    21123    settings settings_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.settings DROP CONSTRAINT settings_pkey;
       public         postgres    false    209            7           2606    49112 $   static_elements static_elements_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.static_elements
    ADD CONSTRAINT static_elements_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.static_elements DROP CONSTRAINT static_elements_pkey;
       public         postgres    false    231            �
           2606    16683    texts texts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.texts DROP CONSTRAINT texts_pkey;
       public         postgres    false    198                       2606    16685    texts_plugs texts_plugs_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.texts_plugs
    ADD CONSTRAINT texts_plugs_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.texts_plugs DROP CONSTRAINT texts_plugs_pkey;
       public         postgres    false    200            +           2606    49026     unknown_words unknown_words_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.unknown_words
    ADD CONSTRAINT unknown_words_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.unknown_words DROP CONSTRAINT unknown_words_pkey;
       public         postgres    false    225            !           2606    48962 "   users_channels users_channels_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.users_channels
    ADD CONSTRAINT users_channels_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.users_channels DROP CONSTRAINT users_channels_pkey;
       public         postgres    false    219                       2606    21092    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         postgres    false    207            �
           1259    16686    admins_id_uindex    INDEX     H   CREATE UNIQUE INDEX admins_id_uindex ON public.admins USING btree (id);
 $   DROP INDEX public.admins_id_uindex;
       public         postgres    false    196            �
           1259    16687    admins_login_uindex    INDEX     N   CREATE UNIQUE INDEX admins_login_uindex ON public.admins USING btree (login);
 '   DROP INDEX public.admins_login_uindex;
       public         postgres    false    196                       1259    21138    attachments_id_uindex    INDEX     R   CREATE UNIQUE INDEX attachments_id_uindex ON public.attachments USING btree (id);
 )   DROP INDEX public.attachments_id_uindex;
       public         postgres    false    211                       1259    21139    attachments_name_uindex    INDEX     V   CREATE UNIQUE INDEX attachments_name_uindex ON public.attachments USING btree (name);
 +   DROP INDEX public.attachments_name_uindex;
       public         postgres    false    211                       1259    48954    broadcast_channels_id_uindex    INDEX     V   CREATE UNIQUE INDEX broadcast_channels_id_uindex ON public.channels USING btree (id);
 0   DROP INDEX public.broadcast_channels_id_uindex;
       public         postgres    false    217            1           1259    49084    broadcasts_fb_id_uindex    INDEX     ]   CREATE UNIQUE INDEX broadcasts_fb_id_uindex ON public.broadcasts USING btree (broadcast_id);
 +   DROP INDEX public.broadcasts_fb_id_uindex;
       public         postgres    false    229            2           1259    49083    broadcasts_id_uindex    INDEX     P   CREATE UNIQUE INDEX broadcasts_id_uindex ON public.broadcasts USING btree (id);
 (   DROP INDEX public.broadcasts_id_uindex;
       public         postgres    false    229                       1259    48935    buttons_id_uindex    INDEX     J   CREATE UNIQUE INDEX buttons_id_uindex ON public.buttons USING btree (id);
 %   DROP INDEX public.buttons_id_uindex;
       public         postgres    false    215                       1259    48915    buttons_plugs_id_uindex    INDEX     V   CREATE UNIQUE INDEX buttons_plugs_id_uindex ON public.buttons_plugs USING btree (id);
 +   DROP INDEX public.buttons_plugs_id_uindex;
       public         postgres    false    213                       1259    48916    buttons_plugs_name_uindex    INDEX     Z   CREATE UNIQUE INDEX buttons_plugs_name_uindex ON public.buttons_plugs USING btree (name);
 -   DROP INDEX public.buttons_plugs_name_uindex;
       public         postgres    false    213            -           1259    49052    custom_postbacks_id_uindex    INDEX     \   CREATE UNIQUE INDEX custom_postbacks_id_uindex ON public.custom_postbacks USING btree (id);
 .   DROP INDEX public.custom_postbacks_id_uindex;
       public         postgres    false    227            0           1259    49053     custom_postbacks_postback_uindex    INDEX     h   CREATE UNIQUE INDEX custom_postbacks_postback_uindex ON public.custom_postbacks USING btree (postback);
 4   DROP INDEX public.custom_postbacks_postback_uindex;
       public         postgres    false    227                       1259    16728    languages_id_uindex    INDEX     N   CREATE UNIQUE INDEX languages_id_uindex ON public.languages USING btree (id);
 '   DROP INDEX public.languages_id_uindex;
       public         postgres    false    205                       1259    16729    languages_locale_uindex    INDEX     V   CREATE UNIQUE INDEX languages_locale_uindex ON public.languages USING btree (locale);
 +   DROP INDEX public.languages_locale_uindex;
       public         postgres    false    205            %           1259    49008    messages_id_uindex    INDEX     L   CREATE UNIQUE INDEX messages_id_uindex ON public.messages USING btree (id);
 &   DROP INDEX public.messages_id_uindex;
       public         postgres    false    223            &           1259    49009    messages_name_uindex    INDEX     P   CREATE UNIQUE INDEX messages_name_uindex ON public.messages USING btree (name);
 (   DROP INDEX public.messages_name_uindex;
       public         postgres    false    223                       1259    16704    plugs_groups_id_uindex    INDEX     T   CREATE UNIQUE INDEX plugs_groups_id_uindex ON public.plugs_groups USING btree (id);
 *   DROP INDEX public.plugs_groups_id_uindex;
       public         postgres    false    203            "           1259    48996    regex_reactions_id_uindex    INDEX     Z   CREATE UNIQUE INDEX regex_reactions_id_uindex ON public.regex_reactions USING btree (id);
 -   DROP INDEX public.regex_reactions_id_uindex;
       public         postgres    false    221                       1259    21124    settings_id_uindex    INDEX     L   CREATE UNIQUE INDEX settings_id_uindex ON public.settings USING btree (id);
 &   DROP INDEX public.settings_id_uindex;
       public         postgres    false    209                       1259    21125    settings_name_uindex    INDEX     P   CREATE UNIQUE INDEX settings_name_uindex ON public.settings USING btree (name);
 (   DROP INDEX public.settings_name_uindex;
       public         postgres    false    209            5           1259    49113    static_elements_id_uindex    INDEX     Z   CREATE UNIQUE INDEX static_elements_id_uindex ON public.static_elements USING btree (id);
 -   DROP INDEX public.static_elements_id_uindex;
       public         postgres    false    231            �
           1259    16688    texts_id_uindex    INDEX     F   CREATE UNIQUE INDEX texts_id_uindex ON public.texts USING btree (id);
 #   DROP INDEX public.texts_id_uindex;
       public         postgres    false    198            �
           1259    16689    texts_plugs_id_uindex    INDEX     R   CREATE UNIQUE INDEX texts_plugs_id_uindex ON public.texts_plugs USING btree (id);
 )   DROP INDEX public.texts_plugs_id_uindex;
       public         postgres    false    200                        1259    21108    texts_plugs_name_uindex    INDEX     V   CREATE UNIQUE INDEX texts_plugs_name_uindex ON public.texts_plugs USING btree (name);
 +   DROP INDEX public.texts_plugs_name_uindex;
       public         postgres    false    200            )           1259    49027    unknown_words_id_uindex    INDEX     V   CREATE UNIQUE INDEX unknown_words_id_uindex ON public.unknown_words USING btree (id);
 +   DROP INDEX public.unknown_words_id_uindex;
       public         postgres    false    225            ,           1259    49028    unknown_words_word_uindex    INDEX     Z   CREATE UNIQUE INDEX unknown_words_word_uindex ON public.unknown_words USING btree (word);
 -   DROP INDEX public.unknown_words_word_uindex;
       public         postgres    false    225                       1259    48973    users_channels_id_uindex    INDEX     X   CREATE UNIQUE INDEX users_channels_id_uindex ON public.users_channels USING btree (id);
 ,   DROP INDEX public.users_channels_id_uindex;
       public         postgres    false    219            
           1259    21093    users_id_uindex    INDEX     F   CREATE UNIQUE INDEX users_id_uindex ON public.users USING btree (id);
 #   DROP INDEX public.users_id_uindex;
       public         postgres    false    207            B           2606    49085 $   broadcasts broadcasts_channels_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.broadcasts
    ADD CONSTRAINT broadcasts_channels_id_fk FOREIGN KEY (channel_id) REFERENCES public.channels(id);
 N   ALTER TABLE ONLY public.broadcasts DROP CONSTRAINT broadcasts_channels_id_fk;
       public       postgres    false    217    229    2846            C           2606    49090 $   broadcasts broadcasts_messages_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.broadcasts
    ADD CONSTRAINT broadcasts_messages_id_fk FOREIGN KEY (message_id) REFERENCES public.messages(id);
 N   ALTER TABLE ONLY public.broadcasts DROP CONSTRAINT broadcasts_messages_id_fk;
       public       postgres    false    2856    223    229            <           2606    48925 #   buttons buttons_buttons_plugs_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buttons
    ADD CONSTRAINT buttons_buttons_plugs_id_fk FOREIGN KEY (plug_id) REFERENCES public.buttons_plugs(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.buttons DROP CONSTRAINT buttons_buttons_plugs_id_fk;
       public       postgres    false    2840    215    213            =           2606    48930    buttons buttons_languages_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buttons
    ADD CONSTRAINT buttons_languages_id_fk FOREIGN KEY (language_id) REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.buttons DROP CONSTRAINT buttons_languages_id_fk;
       public       postgres    false    205    215    2825            ;           2606    48910 -   buttons_plugs buttons_plugs_texts_plugs_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.buttons_plugs
    ADD CONSTRAINT buttons_plugs_texts_plugs_id_fk FOREIGN KEY (text_plug) REFERENCES public.texts_plugs(id) ON UPDATE CASCADE ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.buttons_plugs DROP CONSTRAINT buttons_plugs_texts_plugs_id_fk;
       public       postgres    false    2818    213    200            A           2606    49047 0   custom_postbacks custom_postbacks_messages_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.custom_postbacks
    ADD CONSTRAINT custom_postbacks_messages_id_fk FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.custom_postbacks DROP CONSTRAINT custom_postbacks_messages_id_fk;
       public       postgres    false    2856    227    223            @           2606    49010 .   regex_reactions regex_reactions_messages_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.regex_reactions
    ADD CONSTRAINT regex_reactions_messages_id_fk FOREIGN KEY (message_id) REFERENCES public.messages(id) ON UPDATE CASCADE;
 X   ALTER TABLE ONLY public.regex_reactions DROP CONSTRAINT regex_reactions_messages_id_fk;
       public       postgres    false    223    2856    221            9           2606    16730    texts texts_languages_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_languages_id_fk FOREIGN KEY (language_id) REFERENCES public.languages(id);
 E   ALTER TABLE ONLY public.texts DROP CONSTRAINT texts_languages_id_fk;
       public       postgres    false    198    205    2825            :           2606    16715 *   texts_plugs texts_plugs_plugs_groups_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.texts_plugs
    ADD CONSTRAINT texts_plugs_plugs_groups_id_fk FOREIGN KEY ("group") REFERENCES public.plugs_groups(id);
 T   ALTER TABLE ONLY public.texts_plugs DROP CONSTRAINT texts_plugs_plugs_groups_id_fk;
       public       postgres    false    203    200    2821            8           2606    16691    texts texts_texts_plugs_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_texts_plugs_id_fk FOREIGN KEY (plug_id) REFERENCES public.texts_plugs(id);
 G   ALTER TABLE ONLY public.texts DROP CONSTRAINT texts_texts_plugs_id_fk;
       public       postgres    false    198    2818    200            ?           2606    48968 6   users_channels users_channels_broadcast_channels_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_channels
    ADD CONSTRAINT users_channels_broadcast_channels_id_fk FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON UPDATE CASCADE ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.users_channels DROP CONSTRAINT users_channels_broadcast_channels_id_fk;
       public       postgres    false    2846    217    219            >           2606    48963 )   users_channels users_channels_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.users_channels
    ADD CONSTRAINT users_channels_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.users_channels DROP CONSTRAINT users_channels_users_id_fk;
       public       postgres    false    219    2828    207            �   �   x�5��
�@ �>�wX0a��!��CA�����x[7�%�ײ|���mf��z /<�~f%gcz��P0�W�V9�R\`��R�l�,;�7��d��Ġ�d�_��@�)��8z�Eq�����51��6=��l���E�;��L'�9�U<T�/�.��?�'&i�-Un,4M���;c      �   
   x���          �   
   x���          �   �   x���v
Q���W((M��L�K*-)��+V��L�Q(�)M�1JR+Jtr��K�S�B�
a�>���
�:
@��Z��a��5�@��5�'L6�Q "u�ļ���Gs{�h������日*�V*�$�$R� R.I�T(�,�P(-ڰ���~�%\\ k�{�      �   �   x���v
Q���W((M��L�K*-)��+�/�)M/V��L�Q�K�M�QH+�L�Kɩ��pKR+J��4�}B]�4uԓ3K��Ssԁ\���Ԃ �HӚ˓���lK�١������OI,I�/J��/K�c�Q�6Tې�E��\\ >��|      �   �   x�5ͽ
�0�=Oq����$�C F0�k��-�Qb2�������9R��2�����Q�;�)!���A@�w�\l�� ��-Zr��=o���QM��v/���3�(���\�%=)��П��K�c�=/0      �   
   x���          �   f   x�Ʊ@0 н_q�����M�!Q�r8�䔠���{ukt?@��aa�����B�6OR�׊M6�1�d0Uͨ����e�2��<���	��B�&s�      �   	  x�=�AK�@����s/m!O�$ZJ@[hRAD�v3�k��5�AC�w�Va3o��7�/�٪D�(�����*k�9�%���S�l)�{���f�N�3�bۙ�V�T�S��^����q=+0�N1�y��G!]�Rx��83�~����B�;��<��BGR��^L%j'94��f��ˍt������LM��H!>{��UG����� �aO�+?X��_|�Z94F�Q�/�*/��o�K�M`�Kq|��"	�߄�Wa� o����i[���o��$I~ �s/      �   `   x���v
Q���W((M��L�+�)M/�O/�/-(V��L�Q�K�M�Ts�	uV�0�QPwJ,�LV״��$]�P�o~JjQbI~��sFb	� .. @*�      �   
   x���          �   �   x���v
Q���W((M��L�+N-)��K/V��L�Q�K�M�Q(K�)M�Ts�	uV�0�QPO�H��K�)�/��K�O�HM�V
�%���kZsy�e���pCK�J)0�������҂�Ē���Ē��bd��� �dT�      �   ]  x��RKK�@���\R!�MO���4��e�L��&��J��w�i�/���}|�y�DI3��l �|�U~mI��j,�"]U�P�}XH=��Ӛ�
^�x�н���@��Ǉ���E�g����k����S3���gX�A�9eY2��'�2���I�nFX�Z.���:��0i��ѐ7���ykʷ����gVYb�&����B�M.5��6��wPƴ #dN�T�@�PH�F�31oW�!,�����̿�m{�A����2V>���"����d�
�������8C,��\B!IڝU�Q�qň�]�,p�٫���b��g���4_��m*�}�q<W�����      �   1  x��RMK1��W��m!��-x��R�V���ݍ��4)�[��ޗ]��.$y	���f�Z/6X�6��5�5Ř�;GM���M��6��`�UUZJ#<��k�٭��er]����DA�=�4(��="S`51��kl}���}�!�c�eoBNٍwZ؄�Z�1ܲRD�ޥu�c4���u�LA�]���Zs��+u9ƕg��eޤoן����/9��H��\A�Ϳ��$�Ӟ\���>��H9�$��R0U��ȧ��ݫ�¬Kg����,�����)~m0���7�      �   V  x����O�0 �;ŋ �&�g�I#�b�t�k��ͶS��ms�[o�x�����t6��-`:[�@QF���~Y���< �:V�0�d ��@�J��ê{�RT'}x�{ZN��н'
uAR#$���5��!G��
�6(�,#�xt���A��3�����=GŌU�)33c�����BB�B����>��~r�>l�?J�n�&���;o�a���mD��ݜ_�EӜ)tzm�����M���r[W:�&�}�"*�pf�-��>7Gpc��cKWu��u��<�޵�w�h�TN��%���d�7���Vu����
�ȿ�˯�#2m�����t~ L��p      �   
   x���          �   
   x���          �   
   x���         
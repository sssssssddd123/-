DROP TABLE posts purge;
-- -> id
-- -> pw
-- -> pwCheck
-- -> name
-- -> tel

CREATE TABLE users(
    id VARCHAR2(20) PRIMARY KEY,
    pw VARCHAR2(20) NOT NULL,
    pwCheck VARCHAR2(20) NOT NULL,
    name VARCHAR2(10) NOT NULL,
    tel VARCHAR2(20) NOT NULL
    );
--------------------------------------------------------------------------------

-- -> postno
-- -> id
-- -> title
-- -> content

CREATE TABLE posts(
    postno number(3) PRIMARY KEY,
    id VARCHAR2(20) NOT NULL,
    title VARCHAR2(20) NOT NULL,
    content VARCHAR2(100) NOT NULL
    );
--------------------------------------------------------------------------------

-- -> postno
-- -> id
-- -> title
-- -> content
-- -> coment

CREATE TABLE posts(
    id VARCHAR2(20) PRIMARY KEY,
    id VARCHAR2(20) NOT NULL,
    title VARCHAR2(20) NOT NULL,
    content VARCHAR2(100) NOT NULL
    );
--------------------------------------------------------------------------------

SELECT * FROM users;
SELECT * FROM posts;

CREATE SEQUENCE posts_seq;

DROP SEQUENCE posts_seq;

INSERT INTO posts(postno, id, title, content)
VALUES(posts_seq.NEXTVAL, '승1', '시퀀스1', '시퀀스 test 1');

INSERT INTO posts(postno, id, title, content)
VALUES(posts_seq.NEXTVAL, '승2', '시퀀스2', '시퀀스 test 2');

INSERT INTO posts(postno, id, title, content)
VALUES(posts_seq.NEXTVAL, '승3', '시퀀스3', '시퀀스 test 3');

INSERT INTO posts(postno, id, title, content)
VALUES(posts_seq.NEXTVAL, '승4', '시퀀스4', '시퀀스 test 4');

--------------------------------------------------------------------------------




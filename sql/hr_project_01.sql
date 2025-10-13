-- =====================================
-- 0️⃣ 기존 테이블, 시퀀스, 뷰 삭제
-- =====================================

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE todolist CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE comment_all CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE post CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE users CASCADE CONSTRAINTS PURGE';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_user_no';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_post_no';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_comment_no';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE seq_todo_no';
EXCEPTION WHEN OTHERS THEN NULL; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP VIEW recent_posts_view';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF; END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP VIEW recent_comments_view';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF; END;
/

-- =====================================
-- 1️⃣ 테이블 생성
-- =====================================
CREATE TABLE users (
    user_no   NUMBER(5, 0) NOT NULL,
    user_id   VARCHAR2(20 BYTE) NOT NULL,
    user_pw   VARCHAR2(20 BYTE) NOT NULL,
    name      VARCHAR2(10 BYTE) NOT NULL,
    tel       VARCHAR2(20 BYTE) NOT NULL
);

ALTER TABLE users ADD CONSTRAINT PK_USERS PRIMARY KEY (user_no);
ALTER TABLE users ADD CONSTRAINT UQ_USERS_USER_ID UNIQUE (user_id);

CREATE TABLE post (
    post_no       NUMBER(5, 0) NOT NULL,
    user_id       VARCHAR2(20 BYTE) NOT NULL,
    post_title    VARCHAR2(20 BYTE) NOT NULL,
    post_content  VARCHAR2(1000 BYTE) NOT NULL,
    created_at    DATE NOT NULL,
    updated_at    DATE NOT NULL
);

CREATE TABLE comment_all (
    comment_no    NUMBER(5, 0) NOT NULL,
    post_no       NUMBER(5, 0) NOT NULL,
    user_id       VARCHAR2(20 BYTE) NOT NULL,
    post_comment  VARCHAR2(100 BYTE) NOT NULL,
    created_at    DATE NOT NULL
);

CREATE TABLE todolist (
    todo_no       NUMBER(5, 0) NOT NULL,
    user_id       VARCHAR2(20 BYTE) NOT NULL,
    todo_content  VARCHAR2(50 BYTE) NULL
);

ALTER TABLE post ADD CONSTRAINT PK_POST PRIMARY KEY (post_no);
ALTER TABLE comment_all ADD CONSTRAINT PK_COMMENT_ALL PRIMARY KEY (comment_no);
ALTER TABLE todolist ADD CONSTRAINT PK_TODOLIST PRIMARY KEY (todo_no);

-- =====================================
-- 2️⃣ 시퀀스 생성
-- =====================================
CREATE SEQUENCE SEQ_USER_NO START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_POST_NO START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_COMMENT_NO START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE SEQ_TODO_NO START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- =====================================
-- 3️⃣ 프로시저 생성
-- =====================================

-- 회원 등록
CREATE OR REPLACE PROCEDURE add_user (
    p_user_id IN VARCHAR2,
    p_user_pw IN VARCHAR2,
    p_name    IN VARCHAR2,
    p_tel     IN VARCHAR2
)
AS
BEGIN
    INSERT INTO users (user_no, user_id, user_pw, name, tel)
    VALUES (SEQ_USER_NO.NEXTVAL, p_user_id, p_user_pw, p_name, p_tel);
    COMMIT;
END;
/

-- 글쓰기
CREATE OR REPLACE PROCEDURE write_post (
    p_user_id   IN VARCHAR2,
    p_title     IN VARCHAR2,
    p_content   IN VARCHAR2
)
AS
BEGIN
    INSERT INTO post (
        post_no, user_id, post_title, post_content, created_at, updated_at
    )
    SELECT SEQ_POST_NO.NEXTVAL, u.user_id, p_title, p_content, SYSDATE, SYSDATE
    FROM users u
    WHERE u.user_id = p_user_id;
    COMMIT;
END;
/

-- 댓글쓰기
CREATE OR REPLACE PROCEDURE write_comment (
    p_user_id      IN VARCHAR2,
    p_post_no      IN NUMBER,
    p_post_comment IN VARCHAR2
)
AS
BEGIN
    INSERT INTO comment_all (
        comment_no, post_no, user_id, post_comment, created_at
    )
    SELECT SEQ_COMMENT_NO.NEXTVAL, p.post_no, u.user_id, p_post_comment, SYSDATE
    FROM users u
    JOIN post p ON p.post_no = p_post_no
    WHERE u.user_id = p_user_id;
    COMMIT;
END;
/

-- =====================================
-- 4️⃣ 뷰 생성 (최근 글 / 최근 댓글)
-- =====================================

CREATE OR REPLACE VIEW recent_posts_view AS
SELECT *
FROM (
    SELECT u.user_id,
           p.post_no,
           p.post_title,
           p.post_content,
           p.created_at AS post_date,
           p.updated_at AS updated_date
    FROM users u
    JOIN post p ON u.user_id = p.user_id
    ORDER BY p.created_at DESC
)
WHERE ROWNUM <= 10;
/

CREATE OR REPLACE VIEW recent_comments_view AS
SELECT *
FROM (
    SELECT u.user_id,
           c.comment_no,
           c.post_no,
           c.post_comment,
           c.created_at AS comment_date
    FROM users u
    JOIN comment_all c ON u.user_id = c.user_id
    ORDER BY c.created_at DESC
)
WHERE ROWNUM <= 10;
/

-- =====================================
-- 5️⃣ 실행 예제
-- =====================================

-- 회원 추가
EXEC add_user('seung', '1234', '승1', '010-1111-2222');

-- 글쓰기
EXEC write_post('lee', '여섯 번째 글', '여섯 번째 내용');

-- 댓글쓰기
EXEC write_comment('seung', 2, '여섯 번째 댓글');


-- 최근 10개의 글 조회
SELECT * FROM recent_posts_view
WHERE user_id = 'seung';

-- 최근 10개의 댓글 조회
SELECT * FROM recent_comments_view
WHERE user_id = 'seung';

--------------------------------------------------------------------------------
SELECT * FROM users;
SELECT * FROM post;
SELECT * FROM comment_all;
SELECT * FROM todolist;

--------------------------------------------------------------------------------
SELECT * FROM post ORDER BY post_no DESC;

SELECT * FROM post
WHERE user_id = 'seung';

SELECT * FROM comment_all
WHERE user_id = 'seung';

ALTER TABLE post
    MODIFY post_title VARCHAR2(50 BYTE);

SELECT user_id, user_pw FROM users;
--------------------------------------------------------------------------------
-- 로그인 id, pw 체크
SELECT user_id, user_pw FROM users
		WHERE user_id = 'seung'
		AND user_pw = '1234';
        
SELECT * FROM users
WHERE :user_id AND :user_pw;
--------------------------------------------------------------------------------
SELECT 
    u.user_id, 
    p.post_title
FROM users u
JOIN post p ON u.user_id = p.user_id
WHERE u.user_id = 'seung'
ORDER BY post_no;

SELECT 
    post_no
    post_title,
    post_content,
    user_id,
    TO_CHAR(created_at, 'YY-MM-DD HH24:MI') AS CREATED_AT
FROM post
ORDER BY created_at DESC;

SELECT user_id, post_no, post_comment
		FROM comment_all
		ORDER BY comment_no DESC;

SELECT 
    c.user_id,
    c.post_comment
FROM comment_all c
JOIN post p ON c.post_no = p.post_no
WHERE c.post_no = '1'
ORDER BY c.comment_no DESC;

BEGIN
    write_comment('seung', 2, '여섯 번째 댓글');
END;


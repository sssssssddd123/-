CREATE TABLE board_t(
    board_no NUMBER(5) PRIMARY KEY,
    title VARCHAR2(100) NOT NULL,
    content VARCHAR2(1000) NOT NULL,
    writer VARCHAR2(50) NOT NULL,
    write_date DATE DEFAULT SYSDATE,
    likes NUMBER(3) DEFAULT 0
    );



--1. 게시판 글 연습, 게시판이 잘 되는지 연습 중 입니다. 홍길동
--2. ....
--3. ....
-- boadr_no, title, content, writer, write_date, likes

INSERT INTO board_t(board_no, title, content, writer)
--VALUES(4, '네 번째 글', '이건 네 번째 레슨', '저는 승4예요');
VALUES(board_t_seq.NEXTVAL, '네 번째 글', '시퀀스 test', '승5');

INSERT INTO board_t(board_no, title, content, writer)
VALUES(board_t_seq.NEXTVAL, '첫 번째 글', '시퀀스 test 1', '승1');

INSERT INTO board_t(board_no, title, content, writer)
VALUES(board_t_seq.NEXTVAL, '두 번째 글', '시퀀스 test 2', '승2');

INSERT INTO board_t(board_no, title, content, writer)
VALUES(board_t_seq.NEXTVAL, '세 번째 글', '시퀀스 test 3', '승3');

INSERT INTO board_t(board_no, title, content, writer)
VALUES(board_t_seq.NEXTVAL, '네 번째 글', '시퀀스 test 4', '승4');

INSERT INTO board_t (board_no, title, content, writer)
SELECT board_t_seq.NEXTVAL, title, content, writer
FROM board_t;

ALTER TABLE board_t
    MODIFY board_no NUMBER(10);

SELECT *
FROM board_t;

DELETE FROM board_t;

CREATE SEQUENCE board_t_seq;
--INCREMENT BY 5
--START WITH 100
--MAXVALUE 121
--MINVALUE 100
--CYCLE;

DROP SEQUENCE board_t_seq;

SELECT board_t_seq.NEXTVAL FROM dual;

SELECT b.*
FROM board_t b
ORDER BY board_no DESC;

SELECT b.*
FROM(SELECT ROWNUM rn, a.*
     FROM (SELECT b.*
           FROM board_t b
           ORDER BY board_no) a) b
WHERE b.rn > (:PAGE - 1) * 10
AND   b.rn <= (:PAGE * 10);


SELECT /*+ INDEX_DESC(b SYS_C008650)*/ b.*
FROM board_t b;

SELECT b.*
FROM(SELECT /*+ INDEX_DESC(b SYS_C008650)*/ ROWNUM rn, a.*
     FROM board_t a) b
WHERE b.rn > (:PAGE - 1) * 10
AND   b.rn <= (:PAGE * 10);

CREATE INDEX board_write_date_idx
ON board_t(write_date);
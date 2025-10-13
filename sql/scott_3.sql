SELECT * FROM tab;

SELECT * FROM USER_RECYCLEBIN;

FLASHBACK TABLE new_table TO BEFORE DROP;

SELECT 'PURGE TABLE "' || TNAME || '";'FROM tab
WHERE TNAME LIKE 'BIN%';

--------------------------------------------------------------------------------
-- 제약조건 p325 --
CREATE TABLE new_emp(
    no NUMBER(4) CONSTRAINT emp_no_pk PRIMARY KEY, -- UNIQUE(중복 값 금지) + NOT NULL
    name VARCHAR2(20) CONSTRAINT emp_name_nn NOT NULL, -- NULL 금지
    jumin VARCHAR2(13) CONSTRAINT emp_jumin_nn NOT NULL -- NULL 금지
                       CONSTRAINT emp_jumin_uk UNIQUE, -- 해당 컬럼 안의 값과 비교하여 중복 값 금지
    loc_code NUMBER(1) CONSTRAINT emp_area_ck CHECK(loc_code < 5), -- 5글자 이상 금지
    deptno NUMBER(2, 0) CONSTRAINT emp_dept_fk REFERENCES dept(deptno) --
    );
    
SELECT *
FROM new_emp;

-- CREATE TABLE: 테이블 새로 만들기
CREATE TABLE new_table (
 no NUMBER(3) PRIMARY KEY, -- 회원번호 1 ~ 999
 name VARCHAR2(10) NOT NULL, -- 이름(최대 10자) hongkildon
 birth DATE DEFAULT SYSDATE -- 생일 TO_DATE('2020-01-01', 'RRRR/MM/DD')
);
-- PRIMARY KEY: 중복된 값을 못넣게하는 문법
-- NOT NULL: 컬럼 속에 빈 값이 있으면 안 됨
-- DEFAULT SYSDATE: 기본 값을 SYSDATE로 지정

-- READ ONLY: 읽기 전용으로 변경
-- 조회만 가능하도록 변경(데이터 업데이트, 추가, 삭제 등 안 됨)
ALTER TABLE new_table READ ONLY;

SELECT * FROM new_table;

-- ALTER TABLE: 테이블 구조 변경
-- ADD: 컬럼 추가
ALTER TABLE new_table
    ADD phone VARCHAR2(20);

-- INSERT INTO VALUES: 테이블 속 컬럼의 값을 추가
INSERT INTO new_table(no, name)
VALUES(1, '홍길동');

INSERT INTO new_table(no, name, birth)
VALUES(3, '홍길동', '2001-01-01');

-- UPDATE SET: 테이블 속 컬럼의 값을 변경
UPDATE new_table
    SET phone = '010-1111-1111'
    WHERE no = 1;
    
UPDATE new_table
    SET phone = '010-2222-2222', 
        birth = TO_DATE('2001-02-02', 'RRRR/MM/DD')
    WHERE no = 2;

-- RENAME COLUMN: 컬럼의 이름을 변경
ALTER TABLE new_table
    RENAME COLUMN phone TO tel;

-- MODIFY: 컬럼의 데이터 크기 변경
ALTER TABLE new_table
    MODIFY tel VARCHAR2(30);

-- DROP COLUMN: 컬럼 삭제
ALTER TABLE new_table
    DROP COLUMN tel;
    
-- TRUNCATE TABLE: 꼬리 삭제(컬럼은 남아있으나 안의 데이터는 삭제 됨)
TRUNCATE TABLE new_table;

-- DROP TABLE: 테이블 삭제(삭제된 테이블은 휴지통에 보관 됨)
DROP TABLE new_table;

-- PURGE: 휴지통에 안 넣고 바로 삭제 됨
-- ***공부할 때 제외하고 실무에선 절대 사용하지 말 것***
DROP TABLE new_table purge;

SELECT * FROM new_table;

-- ROLLBACK: 이전 커밋 지점으로 되돌림
ROLLBACK;

-- DELETE FROM: 값을 삭제(WHERE를 사용하면 해당 값만 삭제)
DELETE FROM new_table
WHERE no = 2;

SELECT * FROM new_table;

-- GENERATED ALWAYS AS: 가상 컬럼 테이블(잘 안 씀, 그냥 알아만두자)
ALTER TABLE new_table
ADD INFO GENERATED ALWAYS AS (no || '-' || name);


--------------------------------------------------------------------------------
SELECT * FROM dept2;

SELECT * FROM dept2
ORDER BY dcode;

DESC DEPT2;

INSERT INTO dept2(dcode, dname, pdept, area)
VALUES(9000, 'temp_1', 1006, 'temp area');

INSERT INTO dept2(dcode, pdept, dname, area)
VALUES(9001, 1006, 'temp_1', 'temp area');
--------------------------------------------------------------------------------
-- CTAS 방식
-- CREATE, TABLE을 활용해서 추가하는 방식
-- professor 테이블을 복제한다(데이터도 같이 복제 됨)
CREATE TABLE professor3
AS
SELECT * FROM professor
WHERE 1=2;

-- ITAS 방식
-- INSERT, TABLE을 활용해서 추가하는 방식
-- professor3 테이블에 professor 데이터를 넣는다
INSERT INTO professor3
SELECT * FROM professor;

SELECT * FROM professor3;
--------------------------------------------------------------------------------
-- ex) 297p --
CREATE TABLE prof_1(
    profno NUMBER, 
    name VARCHAR(20));

CREATE TABLE prof_2(
    profno NUMBER, 
    name VARCHAR(25));

SELECT * FROM prof_1;
SELECT * FROM prof_2;
    
INSERT ALL
    WHEN profno BETWEEN 1000 AND 1999 
        THEN INTO prof_1 VALUES (profno, name)
    WHEN profno BETWEEN 2000 AND 2999 
        THEN INTO prof_2 VALUES (profno, name)
SELECT profno, name
FROM professor;

INSERT ALL
    INTO prof_1 VALUES (profno, name)
    INTO prof_2 VALUES (profno, name)
SELECT profno, name
FROM professor;
--------------------------------------------------------------------------------
-- UPDATE p299 --
SELECT * FROM professor;

UPDATE professor
SET    bonus = DECODE(bonus, NULL, 100, bonus)
       , pay = pay * 1.1
       -- 예제) hpage를 eamil의 주소로 변경해 보기
WHERE  1=1;

ROLLBACK;
--------------------------------------------------------------------------------
-- DELETE p300 --
SELECT * FROM professor;

DELETE FROM professor
WHERE hpage IS NOT NULL;

ROLLBACK;

-- dept 삭제
SELECT * FROM dept;

DELETE FROM dept
WHERE deptno = 40;

DELETE FROM dept
WHERE deptno = 30;
-- 40번은 삭제가 되나, 30번은 삭제가 안 됨

SELECT * FROM emp;
-- emp 테이블에서 dept의 deptno를 참조하고 있으므로(이미 사용 중이므로) 삭제가 안 됨

-- emp에서 먼저 삭제를 해 줘야 dept에서 삭제가 가능
DELETE emp
WHERE deptno = 30;

-- 번외)
UPDATE emp
SET deptno = 50
WHERE deptno = 20; 
-- deptno라는 부모에게 50이란 데이터가 없어서 데이터를 가져올 수 없음

ROLLBACK;
--------------------------------------------------------------------------------
-- UPDATE JOIN p306 --
SELECT * FROM emp e, dept d
WHERE e.deptno = d.deptno
ORDER BY e.deptno;

-- EXISTS에 해당되는 값을 업데이트
UPDATE emp e
SET    sal = sal + 100
WHERE EXISTS (SELECT * -- 여기서 SELECT는 딱히 의미가 없는 구문임, FROM 앞에 SELECT가 있어야 되니 작성하는 것
              FROM dept d
              WHERE e.deptno = d.deptno
              AND d.loc = 'DALLAS');
              
-- UPDATE하기 전에 불안하면 SELECT로 값을 확인 후 변경하기
SELECT *
FROM emp e
WHERE EXISTS (SELECT *
              FROM dept d
              WHERE e.deptno = d.deptno
              AND d.loc = 'DALLAS');

ROLLBACK;
--------------------------------------------------------------------------------
-- memo --
-- 오라클(DB) 서버 <-> 웹서버(Node) <-> 클라이언트 서버(PC, 노트북, 모바일 등 웹브라우저)
--------------------------------------------------------------------------------
-- 게시판, 회원관리, 상품관리 --
SELECT *
FROM emp;

--------------------------------------------------------------------------------
SELECT * FROM emp;

INSERT INTO emp(empno, ename, job, hiredate, deptno)
VALUES (9999, 'Hong', 'SALESMAN', TO_DATE('1980/03/01', 'RRRR-MM-DD'), 30);

--UPDATE emp
--SET
--WHERE
--------------------------------------------------------------------------------
SELECT * FROM emp;

-- sal 1000이하를 1000으로 변경
UPDATE emp
SET sal = 1000
WHERE sal < 1000;

-- salesman 직무 중 comm 500이하를 500으로 변경
UPDATE emp
SET comm = DECODE(comm, NULL, 500, 500)
WHERE job = 'SALESMAN';

-- 1981년 전반기에 입사한 사원(1~6월)들의 급여 10% 인상
UPDATE emp
SET sal = sal * 1.1
WHERE HIREDATE >= '1981/01/01'
  AND HIREDATE < '1981/07/01';

--------------------------------------------------------------------------------
SELECT *
FROM professor;

SELECT *
FROM student;

-- Rene Russo 학생의 담당교수의 번호, 이름, position 확인
SELECT s.name
     , p.profno
     , p.name
     , p.position
FROM student s
JOIN professor p
  ON s.deptno1 = p.deptno
WHERE s.name = 'Rene Russo';

-- dname: Computer Engineering인 학생들의 학번, 이름 확인
-- deptno: 101
SELECT *
FROM department;

SELECT *
FROM student;

SELECT s.name
     , s.deptno1
FROM student s
LEFT OUTER JOIN department d
  ON d.deptno = s.deptno1
WHERE s.deptno1 = 101;

-- deptno 1, 2 학생 모두 갖고오기(dname: Computer Engineering)
SELECT s.name
     , s.deptno1
     , s.deptno2
FROM student s
LEFT OUTER JOIN department d
  ON d.deptno = s.deptno1
WHERE s.deptno1 = 101
   OR s.deptno2 = 101;

-- 학생 중에 deptno1: 101인 학생들의 담당교수의 번호, 이름, position 확인
-- dname: Computer Engineering
SELECT *
FROM professor;

SELECT *
FROM student
ORDER BY DEPTNO1 ASC;

SELECT DISTINCT p.profno
     , p.name
     , p.position
FROM professor p
JOIN student s
  ON p.profno = s.profno
JOIN department d
  ON s.deptno1 = d.deptno
WHERE d.dname = 'Computer Engineering';

-- 담당이 assistant professor인 학생 출력
SELECT DISTINCT position
FROM professor;

SELECT *
FROM professor;

SELECT *
FROM student;

SELECT *
FROM student s
JOIN professor p
  ON s.profno = p.profno
WHERE p.position = 'assistant professor';
--------------------------------------------------------------------------------
-- 전공이 'Computer Engineering'인 학생들의 몸무게 평균
-- dname: Computer Engineering
-- height, weight
SELECT *
FROM professor;

SELECT *
FROM student;

SELECT *
FROM department;

SELECT *
FROM student ss
WHERE ss.weight > (SELECT avg(s.weight)
                   FROM student s
                   JOIN department d
                   ON s.deptno1 = d.deptno
                   WHERE d.dname = 'Computer Engineering')
ORDER BY weight;

-- 전공이 'Electronic Engineering'인 학생들의 담당교수
-- dname: 'Electronic Engineering'
SELECT *
FROM professor;

SELECT *
FROM student;

SELECT *
FROM department;

--------------------------------------------------------------------------------
-- SUB SELECT 활용 --
SELECT *
FROM professor pp
WHERE pp.position IN (SELECT p.position
                      FROM professor p
                      JOIN student s
                      ON p.profno = s.profno
                      JOIN department d
                      ON s.deptno1 = d.deptno
                      WHERE d.dname = 'Electronic Engineering');

-- 급여가 평균 이상인 교수들 출력
-- profno, name, pay
SELECT AVG(pay)
FROM professor;

SELECT profno
     , name
     , pay AS "평균 급여: 370"
FROM professor p
WHERE p.pay >= (SELECT AVG(pay)
                FROM professor)
ORDER BY pay ASC;

-- 보너스: null인 사람 중에 입사일이 제일 낮은 사람 제외하고 출력
SELECT *
FROM professor
ORDER BY bonus ASC;

SELECT MIN(hiredate) AS "값: 1998/03/22"
FROM professor
WHERE bonus IS NULL;

SELECT name
     , hiredate
     , bonus
FROM professor p
WHERE p.hiredate != (SELECT MIN(hiredate)
                     FROM professor
                     WHERE bonus IS NULL)
AND p.bonus IS NULL
ORDER BY hiredate ASC;
--------------------------------------------------------------------------------

SELECT *
FROM emp;

SELECT *
FROM dept;

SELECT e.ename
     , e.job
     , d.dname
FROM emp e
JOIN dept d ON e.deptno = d.deptno;


-- VIEW --
SELECT e.*, d.*
FROM emp e
JOIN dept d ON e.deptno = d.deptno;

CREATE OR REPLACE VIEW emp_dept_v
AS
SELECT empno, ename, job, sal, e.deptno, dname, comm
FROM emp e
JOIN dept d
ON e.deptno = d.deptno;

SELECT *
FROM emp_dept_v;

CREATE OR REPLACE VIEW emp_v
AS
SELECT empno, ename, job, deptno
FROM emp;

-- 학생, 담당교수 뷰
SELECT studno, name, birthday, tel
FROM student;

SELECT V.*
FROM stud_prof_v v
JOIN department d
ON v.deptno = d.deptno
WHERE position = 'a full professor';

SELECT profno, name, position, email
FROM professor;

CREATE OR REPLACE VIEW stud_prof_v AS
SELECT studno
     , s.name stedent
     , s.birthday
     , s.tel
     , s.deptno1 deptno
     , p.profno
     , p.name professor
     , p.position
     , p.email
FROM student s
LEFT OUTER JOIN professor p
ON s.profno = p.profno;

-- 뷰는 되도록 조회용으로 쓰자 가급적 업데이트 금지
--UPDATE emp_v
--SET ename = ''
--WHERE empno = '9999';
--------------------------------------------------------------------------------
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





--------------------------------------------------------------------------------

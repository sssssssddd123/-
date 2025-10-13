SELECT empno
     , ename
     , job
     , mgr
FROM emp;


-- 표현식 사용
SELECT empno AS "사원번호" -- 별칭(alias)
     , ename AS "사원명" -- 컬럼의 제목을 바꿔줌
     , 'Good Mornig !! ' || ename AS "wecome 메세지" -- ||는 ename 값 앞에 추가로 붙여줌
     , ename||'''의 급여 ' || sal AS "급여" -- " eanme'의 급여 " 이름 뒤에 '을 붙여줌
FROM emp;


-- distinct 중복 값 제거
SELECT DISTINCT job -- job 속의 중복 값 제거
FROM emp;

SELECT DISTINCT job, deptno -- job와 deptno의 중복 값 제거
FROM emp;

SELECT DISTINCT job, deptno
FROM emp
ORDER BY job ASC; -- job 기준으로 오름차순 정렬, desc는 내림차순 정렬

-- 연습문제 1
SELECT * FROM student;

SELECT NAME||'''s ID: '||ID||' , WEIGHT is '||weight||'kg' AS "id and weight"
FROM student;

-- 연습문제 2
SELECT * FROM emp;

SELECT ename||'('||JOB||'), '||ename||''''||job||'''' AS "name and job"
FROM emp;

-- 연습문제 3
SELECT ename||'''s sal is $'||sal AS "name and sal"
FROM emp;


-- 조건절
SELECT empno
     , ename
     , job
     , mgr
     , hiredate
     , sal
     , comm
     , sal +  comm AS "SAL + COMM"
     , deptno
FROM emp
WHERE 1=1
  AND empno >= 7900
  AND empno < 8000
  AND hiredate >= '1982/01/01'
  AND hiredate < '1983/01/01';
-- where = 지정한 컬럼에서 내가 원하는 값을 가져온다
-- 연산자도 사용 가능
-- BETWEEN a AND b, 
-- AND, OR, 
-- IS NULL, IS NOT NULL, 
-- LIKE 등
-- %의 의미: %LA% LA라는 앞,뒤 값을 신경 안 쓴다는 의미
-- %LA: LA로 끝나는 값을 가져온다.
-- LA%: LA로 시작하는 값을 가져온다.

SELECT * FROM PROFESSOR
WHERE 1=1
  AND EMAIL LIKE '%@naver.com'
  AND PAY + NVL(BONUS, 0) >= 300;
-- NVL(값, 0) = 값이 null 경우 0으로 처리한다

SELECT PROFNO
     , LOWER(NAME) AS "Low_name"
     , UPPER(ID) AS " Upp_id"
     , INITCAP(POSITION) AS "pos"
     , PAY
     , CONCAT(CONCAT(NAME, '-'), ID) AS "name_id"
FROM PROFESSOR
WHERE 1=1 
  AND LENGTH(NAME) <> 10;

SELECT NAME
     , LENGTH(NAME) AS "length"
     , LENGTH('홍길동') AS "k-length"
     , LENGTHB('홍길동') AS "lengthb"
     -- 한글은 LENGTHB 함수를 사용할 경우 한 글자당 3의 값을 출력한다.
     , SUBSTR(NAME, 1, 5) AS "substr"
     , INSTR(NAME, 'a') AS  "instr"
     , PAY
     , BONUS
     , LENGTH(ID) AS "length-id"
     , LPAD(ID, 10, '*') AS "lpad"
     , LTRIM(LPAD(ID, 10, '*'), ('*')) AS "ltrim"
     , RPAD(ID, 10, '*') AS "rpad"
     , RTRIM(RPAD(ID, 10, '*'), ('*')) AS "rtrim"
     , replace('Hello', 'H', 'M') as "rap"     
FROM PROFESSOR
WHERE INSTR(UPPER(NAME), 'A') > 0;

SELECT * FROM STUDENT;

SELECT NAME
     , TEL
     , SUBSTR(TEL, 1, INSTR(TEL, ')')-1) AS "AREA CODE"
FROM STUDENT
WHERE DEPTNO1 = 201;

SELECT * FROM EMP;

SELECT ENAME
     , REPLACE(ENAME, SUBSTR(ENAME, 2, 3), '--') AS "REPLACE"
FROM EMP
WHERE DEPTNO = 20;

SELECT * FROM STUDENT;

SELECT NAME
     , JUMIN
     , REPLACE(JUMIN, SUBSTR(JUMIN, 7, 13), '-/-/-/-') AS "REPALCE"
FROM STUDENT
WHERE DEPTNO1 = 101;

SELECT * FROM STUDENT;

SELECT NAME
     , TEL
     , REPLACE
       (REPLACE(TEL, SUBSTR(TEL, 5, 12), '***-1234')
       , '-1234', SUBSTR(TEL, 8, 12)) AS "REPLACE"

FROM STUDENT
WHERE DEPTNO1 = 102;

SELECT NAME
     , TEL
     , REPLACE
       (TEL, SUBSTR(TEL, INSTR(TEL, '-')+1, 4), '****') AS "REPALCE"
FROM STUDENT
WHERE DEPTNO1 = 101;

SELECT EMPNO
     , ENAME
     , JOB
     , ROUND(SAL / 12, 2) AS "MONTH"
     , TRUNC(SAL / 12) AS "TRUNC"
     , MOD(SAL, 12) AS "MOD"
     , CEIL(SAL / 12) AS "CEIL"
     , FLOOR(SAL / 12) AS "FLOOR"
     , POWER(4, 3) AS "POW"
FROM EMP;

SELECT *
FROM EMP
WHERE HIREDATE > '1982/01/01'; -- RR/MM/DD, RRRR/MM/DD

SELECT MONTHS_BETWEEN('15/01/01', '10/01/01')
FROM DUAL;

SELECT ADD_MONTHS(SYSDATE, 2)
     , NEXT_DAY(SYSDATE + 1, '목') AS "NEXT_DAY"
     , LAST_DAY(SYSDATE) AS "LAST_DAY"
     , LAST_DAY(ADD_MONTHS(SYSDATE, 5)) AS "LAST_DAY + MONTHS"
FROM DUAL;

SELECT SYSDATE
     , TO_CHAR(SYSDATE, 'RRRR-MM-DD HH24:MI:SS') AS "TODAY"
     , TO_DATE('2025-09-24', 'RRRR-MM-DD') AS "DATE"
FROM DUAL
WHERE 1=1;









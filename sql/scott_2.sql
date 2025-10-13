SELECT *
FROM TAB;

SELECT SYSDATE, TO_CHAR(SYSDATE, 'RRRR-MM-DD') AS "SYSTEM"
     , TO_CHAR(12345.6, '$099,999.99') AS "NUMBER"
FROM DUAL;

SELECT EMPNO
     , ENAME
     , JOB
     , TO_CHAR(SAL, '999,999') AS "SALARY"
FROM EMP;

SELECT *
FROM PROFESSOR
WHERE HIREDATE >= TO_DATE('1990/01/01 09:00:00', 'RRRR/MM/DD HH24:MI:SS')
  AND HIREDATE < TO_DATE('2000/01/01 09:00:00', 'RRRR/MM/DD HH24:MI:SS');

SELECT *
FROM EMP
WHERE SAL + NVL(COMM, 0) >= 2000;

SELECT EMPNO
     , ENAME
     , COMM
     , NVL2(COMM, 'Exist', 'NULL') AS "NVL2"
FROM EMP
WHERE DEPTNO = 30;

-- SAL > 30 ? '값1' : '값2'
SELECT EMPNO
     , ENAME
     , DECODE(JOB, 'SALESMAN', '영업부서', '기타부서') AS "DEPT"
     , DECODE(JOB, 'SALESMAN'
            , '영업부서'
            , DECODE(JOB, 'MANAGER', '관리부서', '기타부서')) AS "DEPT_2"
     , JOB
FROM EMP;

SELECT NAME
     , JUMIN
     , SUBSTR(JUMIN, 7, 1) AS "TEST"
     , DECODE(SUBSTR(JUMIN, 7, 1), '1', 'MAN', 'WOMEN') AS "GENDER"
FROM STUDENT;

SELECT name
     , tel
     , grade
     , DECODE(SUBSTR(tel, 1, INSTR(tel, ')')-1), '02', 'SEOUL'
                                               , '031', 'GYEONGGI'
                                               , '051', 'BUSAN'
                                               , '052', 'ULSAN'
                                               , '055', 'GYONGNAM') AS "LOC"
FROM student;

SELECT name
     , tel
     , CASE SUBSTR(tel, 1, INSTR(tel, ')') -1) WHEN '02' THEN 'SEOUL'
                                               WHEN '031' THEN 'GYEONGGI'
                                               WHEN '051' THEN 'BUSAN'
                                               WHEN '052' THEN 'ULSAN'
                                               WHEN '055' THEN 'GYONGNAM'
                                               WHEN '053' THEN 'GYEONGBUK'
                                               ELSE '기타'
       END AS "SOC"
FROM STUDENT
WHERE deptno1 = 101;

SELECT *
FROM professor;

SELECT PROFNO
     , NAME
     , POSITION
     , PAY * 12 AS "PAY"
     , CASE WHEN PAY * 12 > 5000 THEN 'HIgh'
            WHEN PAY * 12 > 4000 THEN 'Mid'
            WHEN PAY * 12 > 3000 THEN 'Low'
            ELSE 'Etc'
       END AS "SAL"
FROM PROFESSOR
WHERE CASE WHEN PAY * 12 > 5000 THEN 'High'
            WHEN PAY * 12 > 4000 THEN 'Mid'
            WHEN PAY * 12 > 3000 THEN 'Low'
            ELSE 'Etc'
       END = 'High';

SELECT EMPNO
     , ENAME
     , SAL
     , CASE WHEN SAL >= 5000 THEN 'LEVEL5'
            WHEN SAL >= 4000 THEN 'LEVEL4'
            WHEN SAL >= 3000 THEN 'LEVEL3'
            WHEN SAL >= 2000 THEN 'LEVEL2'
            WHEN SAL >= 1000 THEN 'LEVEL1'
            WHEN SAL < 1000 THEN 'LEVEL0'
       END AS "PAY"
FROM EMP ORDER BY SAL DESC;

SELECT PROFNO
     , NAME
     , 'Professor'
     , PAY
FROM PROFESSOR
WHERE DEPTNO = 101
UNION
SELECT STUDNO
     , NAME
     , 'Student'
     , 0
FROM STUDENT
WHERE DEPTNO1 = 101;

SELECT JOB
     , COUNT(*) AS "인원"
     , SUM(SAL) AS "직무별 급여 합계"
     , ROUND(AVG(SAL), 1) AS "직무별 급여 평균"
     , ROUND(STDDEV(SAL), 1) AS "표준편차"
     , ROUND(VARIANCE(SAL), 1) AS "분산"
FROM EMP
GROUP BY JOB ORDER BY 인원 ASC;

SELECT TO_CHAR(HIREDATE, 'RRRR') AS "HD"
     , COUNT(*) AS "인원"
     
FROM EMP
GROUP BY TO_CHAR(HIREDATE, 'RRRR');

-- 학생, 학과별 인원
SELECT DEPTNO1
     , COUNT(*) AS "인원"
FROM STUDENT
GROUP BY DEPTNO1
HAVING COUNT(*) > 2; -- HAVING으로 GROUP에 조건을 넣을 수 있음

-- 교수, Position, pay 합계, 최고급여, 최저급여 출력
SELECT Position
     , COUNT(*) AS "인원"
     , SUM(PAY) AS "급여 합계"
     , MAX(PAY) AS "최고 급여"
     , MIN(PAY) AS "최저 급여"
FROM PROFESSOR
GROUP BY Position;

-- 사원, 부서별 평균 급여, 인원
-- 사원, 부서, 직무별 평균 급여, 인원
-- 사원, 평균급여, 인원

-- 부서, 직무, 급여, 인원
-- 부서     , 급여, 인원
-- 부서, 직무, 급여, 인원
-- 부서     , 급여, 인원
--           급여, 인원

SELECT DEPTNO
     , NULL
     , ROUND(AVG(SAL), 1)
     , COUNT(*)
     , ' A'
FROM EMP
GROUP BY DEPTNO
UNION

SELECT DEPTNO
     , JOB
     , ROUND(AVG(SAL), 1)
     , COUNT(*)
     , ' B'
FROM EMP
GROUP BY DEPTNO, JOB
UNION

SELECT NULL
     , NULL
     , ROUND(AVG(SAL), 1)
     , COUNT(*)
     , ' C'
FROM EMP
ORDER BY 1, 2;

SELECT DECODE(NVL(DEPTNO, 999), 999, '전체', DEPTNO) AS "부서"
     , NVL(JOB, '합계') AS "직무"
     , ROUND(AVG(SAL)) AS "평균 급여"
     , COUNT(*) AS "인원"
FROM EMP
GROUP BY ROLLUP(DEPTNO, JOB)
ORDER BY 1, 2;



SELECT COUNT(*) FROM EMP;   -- 12
SELECT COUNT(*) FROM DEPT;  -- 4


SELECT COUNT(*) --DEPT.*, EMP.*
FROM EMP, DEPT;

  ON EMP.DEPTNO = DEPT.DEPTNO;
  
  
SELECT studno, s.name AS "학생명"
     , S.GRADE
     , P.NAME AS "교수명"
     , S.DEPTNO1
     , D.DNAME AS "학과명"
FROM STUDENT S -- 교수 번호
LEFT OUTER JOIN PROFESSOR P
  ON S.PROFNO = P.PROFNO
JOIN DEPARTMENT D
  ON S.DEPTNO1 = D.DEPTNO;

SELECT p.profno
     , s.studno
     , s.name
     , s.profno AS "담당교수"
FROM professor p
--JOIN student s
LEFT OUTER JOIN student s
ON p.profno = s.profno;


SELECT *
FROM salgrade;

SELECT s.grade
     , e.*
FROM emp e
JOIN salgrade s
ON e.sal >= s.losal
AND e.sal <= s.hisal;
--WHERE s.grade = 2;

-- oracle JOIN
SELECT e.*
FROM emp e, dept d
WHERE e.deptno = d.deptno;

SELECT *
FROM emp;
     
SELECT e1.empno AS "사원 번호"
     , e2.ename AS "사원명"
     , e2.empno AS "관리자 번호"
     , e2.ename AS "관리자명"
FROM emp e1, emp e2
WHERE e1.mgr = e2.empno(+);




-- 254p 예제1
SELECT *
FROM DEPARTMENT;
-- 
SELECT s.studno AS "STU_NAME"
     , s.deptno1 AS "DEPTNO01"
     , d.dname AS "DEPT_NAME"
FROM student s
JOIN department d
on s.deptno1 = d.deptno;

-- 예제2
SELECT *
FROM emp2;
-- name, position, pay , low pay, high pay
SELECT e.name AS "NAME"
     , e.position AS "POSITION"
     , e.pay AS "PAY"
     , to_char(p.s_pay, '999,999,999') AS "LOW_PAY"
     , to_char(p.e_pay, '999,999,999') AS "HIGH_PAY"
FROM emp2 e
JOIN p_grade p
ON e.position = p.position;

-- 예제3
SELECT *
FROM emp2;

SELECT *
FROM p_grade;
-- emono, 
-- name, age, curr_position, be_position
SELECT e.name
     , TRUNC(MONTHS_BETWEEN('2013/09/25', e.birthday)/12) AS "AGE"
     , e.position AS "CURR_POSITION"
     , p.position AS "BE_POSITION"
FROM emp2 e
LEFT OUTER JOIN p_grade p
  ON TRUNC(MONTHS_BETWEEN('2013/09/25', e.birthday)/12) >= p.s_age
 AND TRUNC(MONTHS_BETWEEN('2013/09/25', e.birthday)/12) <= P.e_age
ORDER BY AGE ASC;

-- 예제4
SELECT *
FROM CUSTOMER;

SELECT *
FROM GIFT;
-- CUST_NAME, POINT, GIFT_NAME
SELECT c.gname AS "CUST_NAME"
     , c.point AS "POINT"
     , g.gname AS "GIFT_NAME"
FROM customer c
JOIN gift g
  ON c.point > 600001
 AND g.gname = 'Notebook';
     
     
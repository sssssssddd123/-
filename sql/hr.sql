SELECT *
FROM tab;

SELECT *
FROM employees;

SELECT *
FROM departments;

SELECT *
FROM locations;

SELECT *
FROM countries;

SELECT *
FROM jobs;

--------------------------------------------------------------------------------
-- 직원 중 job가 Programmer인 사람들이 어느 도시에서 일 하는지
SELECT e.first_name, e.job_id, l.city
FROM employees e
JOIN departments d
ON  e.department_id = d.department_id
JOIN locations l
ON  l.location_id = d.location_id
JOIN jobs j
ON e.job_id = j.job_id
WHERE e.job_id = 'IT_PROG';

-- job의         min_salary, max_salary
-- employees의   job_id(직무), salary(급여)
-- exists (select ... from ...)활용하여 출력

SELECT j.job_id, j.min_salary, j.max_salary
FROM jobs j;

SELECT e.*
FROM employees e
WHERE NOT EXISTS (SELECT 1
                  FROM jobs j
                  WHERE e.job_id = j.job_id
                  AND e.salary BETWEEN j.min_salary AND j.max_salary);
              
UPDATE employees
SET salary = 20000
WHERE employee_id = 103;

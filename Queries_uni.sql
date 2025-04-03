1.	Retorna un llistat amb el primer cognom, segon cognom i el nom de tots els/les alumnes. El llistat haurà d''estar ordenat alfabèticament de menor a major pel primer cognom, segon cognom i nom.
SELECT apellido1, apellido2, nombre FROM persona WHERE tipo='alumno' ORDER BY apellido1, apellido2, nombre ASC
2.	Esbrina el nom i els dos cognoms dels alumnes que no han donat d''alta el seu número de telèfon en la base de dades.
SELECT nombre, apellido1, apellido2 FROM persona WHERE tipo='alumno'AND telefono IS NULL;
3.	Retorna el llistat dels alumnes que van néixer en 1999.
SELECT nombre, apellido1, apellido2, fecha_nacimiento FROM persona WHERE tipo='alumno'AND fecha_nacimiento BETWEEN '1999-01-01' AND '1999-12-31' ORDER BY fecha_nacimiento;
4.	Retorna el llistat de professors/es que no han donat d''alta el seu número de telèfon en la base de dades i a més el seu NIF acaba en K.
SELECT nombre, apellido1, apellido2 FROM persona WHERE tipo='profesor', telefono IS NULL AND NIF LIKE '%K';
5.	Retorna el llistat de les assignatures que s''imparteixen en el primer quadrimestre, en el tercer curs del grau que té l''identificador 7.
SELECT nombre, tipo FROM asignatura WHERE cuatrimestre=1 AND curso=3 AND id_grado=7;
6.	Retorna un llistat dels professors/es juntament amb el nom del departament al qual estan vinculats. El llistat ha de retornar quatre columnes, primer cognom, segon cognom, nom i nom del departament. El resultat estarà ordenat alfabèticament de menor a major pels cognoms i el nom.
SELECT p.apellido1, p.apellido2, p.nombre, d.nombre AS departamento FROM persona p JOIN profesor prof ON p.id = prof.id_profesor JOIN departamento d ON prof.id_departamento = d.id WHERE p.tipo = 'profesor' ORDER BY p.apellido1, p.apellido2, p.nombre;
7.	Retorna un llistat amb el nom de les assignatures, any d''inici i any de fi del curs escolar de l''alumne/a amb NIF 26902806M.
SELECT a.nombre AS nombre_asignatura, c.anyo_inicio, c.anyo_fin FROM alumno_se_matricula_asignatura am JOIN curso_escolar c ON am.id_curso_escolar = c.id JOIN asignatura a ON am.id_asignatura = a.id WHERE am.id_alumno = (SELECT id FROM persona WHERE nif = '26902806M');
8.	Retorna un llistat amb el nom de tots els departaments que tenen professors/es que imparteixen alguna assignatura en el Grau en Enginyeria Informàtica (Pla 2015).
SELECT DISTINCT d.nombre AS departamento FROM departamento d JOIN profesor p ON d.id = p.id_departamento JOIN asignatura a USING(id_profesor) JOIN grado g ON a.id_grado = g.id WHERE g.nombre = 'Grado en Ingeniería Informática (Plan 2015)';
9.	Retorna un llistat amb tots els alumnes que s''han matriculat en alguna assignatura durant el curs escolar 2018/2019.
SELECT DISTINCT p.nombre, p.apellido1, p.apellido2 FROM persona p JOIN alumno_se_matricula_asignatura am ON p.id = am.id_alumno JOIN curso_escolar c ON am.id_curso_escolar = c.id WHERE c.anyo_inicio BETWEEN 2018 AND 2019;

Resol les 6 següents consultes utilitzant les clàusules LEFT JOIN i RIGHT JOIN.
1.	Retorna un llistat amb els noms de tots els professors/es i els departaments que tenen vinculats. El llistat també ha de mostrar aquells professors/es que no tenen cap departament associat. El llistat ha de retornar quatre columnes, nom del departament, primer cognom, segon cognom i nom del professor/a. El resultat estarà ordenat alfabèticament de menor a major pel nom del departament, cognoms i el nom.
SELECT d.nombre AS departamento, p.apellido1, p.apellido2, p.nombre FROM profesor pr LEFT JOIN departamento d ON pr.id_departamento = d.id JOIN persona p ON pr.id_profesor = p.id ORDER BY d.nombre, p.apellido1, p.apellido2, p.nombre;
2.	Retorna un llistat amb els professors/es que no estan associats a un departament.
SELECT d.nombre AS departamento, p.apellido1, p.apellido2, p.nombre FROM profesor pr LEFT JOIN departamento d ON pr.id_departamento = d.id JOIN persona p ON pr.id_profesor = p.id WHERE d.id IS NULL;
3.	Retorna un llistat amb els departaments que no tenen professors/es associats.
SELECT d.nombre AS departamento FROM departamento d LEFT JOIN profesor pr ON pr.id_departamento = d.id WHERE pr.id_departamento IS NULL;
4.	Retorna un llistat amb els professors/es que no imparteixen cap assignatura.
SELECT p.id AS id_profesor, p.nombre, p.apellido1, p.apellido2 FROM persona p RIGHT JOIN profesor pr ON p.id = pr.id_profesor LEFT JOIN asignatura a ON pr.id_profesor = a.id_profesor WHERE a.id_profesor IS NULL;
5.	Retorna un llistat amb les assignatures que no tenen un professor/a assignat.
SELECT a.id, a.nombre FROM asignatura a LEFT JOIN profesor pr ON a.id_profesor = pr.id_profesor WHERE a.id_profesor IS NULL;

Consultes resum:
1.	Retorna el nombre total alumnes que hi ha.
SELECT COUNT(*) AS total_alumnos FROM persona WHERE tipo = 'alumno';
3.	Calcula quants professors/es hi ha en cada departament. El resultat només ha de mostrar dues columnes, una amb el nom del departament i una altra amb el nombre de professors/es que hi ha en aquest departament. El resultat només ha d''incloure els departaments que tenen professors/es associats i haurà d''estar ordenat de major a menor pel nombre de professors/es.
SELECT d.nombre AS departamento, COUNT(pr.id_profesor) AS num_profesores FROM departamento d JOIN profesor pr ON d.id = pr.id_departamento GROUP BY d.id ORDER BY num_profesores DESC;
4.	Retorna un llistat amb tots els departaments i el nombre de professors/es que hi ha en cadascun d''ells. Tingui en compte que poden existir departaments que no tenen professors/es associats. Aquests departaments també han d''aparèixer en el llistat.
SELECT d.nombre AS departamento, COUNT(pr.id_profesor) AS num_profesores FROM departamento d LEFT JOIN profesor pr ON d.id = pr.id_departamento GROUP BY d.id ORDER BY num_profesores DESC;
5.	Retorna un llistat amb el nom de tots els graus existents en la base de dades i el nombre d''assignatures que té cadascun. Tingues en compte que poden existir graus que no tenen assignatures associades. Aquests graus també han d''aparèixer en el llistat. El resultat haurà d''estar ordenat de major a menor pel nombre d''assignatures.
SELECT g.nombre AS grado, COUNT(a.id) AS num_asignaturas FROM grado g LEFT JOIN asignatura a ON g.id = a.id_grado GROUP BY g.id ORDER BY num_asignaturas DESC;
6.	Retorna un llistat amb el nom de tots els graus existents en la base de dades i el nombre d''assignatures que té cadascun, dels graus que tinguin més de 40 assignatures associades.
SELECT g.nombre AS grado, COUNT(a.id) AS num_asignatura FROM grado g LEFT JOIN asignatura a ON g.id = a.id_grado GROUP BY g.id HAVING num_asignaturas > 40 ORDER BY num_asignaturas DESC;
9.	Retorna un llistat amb el nombre d''assignatures que imparteix cada professor/a. El llistat ha de tenir en compte aquells professors/es que no imparteixen cap assignatura. El resultat mostrarà cinc columnes: id, nom, primer cognom, segon cognom i nombre d''assignatures. El resultat estarà ordenat de major a menor pel nombre d''assignatures.
SELECT p.id AS id, p.nombre AS nom, p.apellido1, p.apellido2, COUNT(a.id) AS num_asignaturas FROM persona p LEFT JOIN profesor pr ON p.id = pr.id_profesor LEFT JOIN asignatura a ON pr.id_profesor = a.id_profesor WHERE pr.id_profesor IS NOT NULL GROUP BY p.id, p.nombre, p.apellido1, p.apellido2 ORDER BY num_asignaturas DESC;
10. Retorna totes les dades de l''alumne/a més jove.
SELECT * FROM persona WHERE tipo = 'alumno' ORDER BY fecha_nacimiento DESC LIMIT 1;
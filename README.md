# 2.2.-BaseDades_N1-N3
This repository contains a series of SQL queries designed to explore and analyze data from two different database schemas: a university database and a store database. These queries demonstrate various SQL techniques, including retrieving specific data, joining tables, performing calculations, filtering results, and manipulating text and date values.

## Query categories: 
- **Retrieving specific data:** Using simple SELECT.
- **Exploring table relationships:** Using inner and outer JOIN to explore and combine data from multiple tables.
- **Performing calculations:** Using COUNT(), SUM(), and other functions to summarize and analyze data.
- **Filtering and sorting data:** Use of WHERE, GROUP BY, HAVING, ORDER BY, and LIMIT clauses for precise data selection and arrangement.
- **Manipulation string and date:** Using functions like UPPER(), LOWER(), etc. and date-related operations to process text and temporal values.


## Databases:
### Store:
A database that models a store with products and manufacturers.

**- Tables:**
  - producto (codigo, nombre, precio, codigo_fabricante)
  - fabricante (codigo, nombre) 

**- Relationships:** producto.codigo_fabricante relates to fabricante.codigo.

### University:
A database modeling a university with students, professors, departments, degrees, and courses.

**- Tables:**
  - departamento
  - persona (students and professors)
  - profesor
  - grado
  - asignatura
  - curso_escolar
  - alumno_se_matricula_asignatura

**- Relationships:**
This database includes various one-to-many and many-to-many relationships between tables.

## Usage:
Each SQL query in this repository serves as an example of common database operations within these two schemas. These queries can be executed in MySQL, PostgreSQL, or other relational database systems with minimal modifications.

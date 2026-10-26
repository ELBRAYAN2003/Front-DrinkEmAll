-- Separa los fernets de "Aperitivos" en su propia categoria.
--
-- "Aperitivos" juntaba 53 productos de los que solo 11 son fernet; el resto son
-- vermuts, coctel y otros aperitivos. Esto crea "Fernet", mueve ahi los fernets
-- y deja "Aperitivos" con lo demas.
--
-- Se puede correr mas de una vez: no duplica la categoria y el UPDATE solo toca
-- lo que sigue en "Aperitivos". Busca las categorias por nombre porque el id
-- cambia de un entorno a otro (14 en la base local, 12 en el servidor).
--
-- Uso:   mysql -u USUARIO -p BASE < deploy/sql/separar-fernet.sql

INSERT INTO categories (name, description, created_at, updated_at)
SELECT 'Fernet', 'Fernets y fernets saborizados', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Fernet');

UPDATE products p
JOIN categories origen ON origen.id = p.category_id AND origen.name = 'Aperitivos'
JOIN categories destino ON destino.name = 'Fernet'
SET p.category_id = destino.id,
    p.updated_at = NOW()
WHERE p.name LIKE '%fernet%';

UPDATE categories
SET description = 'Vermuts, bitters, cocteles y otros aperitivos',
    updated_at = NOW()
WHERE name = 'Aperitivos';

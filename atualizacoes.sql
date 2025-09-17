USE DB_ENTRELACOS;

SELECT * FROM PRODUTO;

SELECT * FROM faleconosco;

ALTER TABLE produto ADD COLUMN precisa_tamanho boolean DEFAULT FALSE;

UPDATE produto SET precisa_tamanho = TRUE WHERE categoria = ('roupa');

UPDATE produto SET tamanhos_disponiveis = '["P", "M", "G", "GG"]' WHERE categoria = ('roupa');

DELETE FROM produto where id_produto >= 10;


ALTER TABLE faleconosco ADD COLUMN origem varchar(20);

UPDATE produto SET tamanhos_disponiveis = '["P", "M", "G", "GG"]' WHERE tamanhos_disponiveis = 'P,M,G,GG';

UPDATE produto SET tamanhos_disponiveis = 'P,M,G,GG' WHERE tamanhos_disponiveis = '["P", "M", "G", "GG"]';

-- MODIFICANDO E ADICIONANDO PRODUTOS
UPDATE produto SET nome_produto = 'Camiseta Feminina' WHERE id_produto = 1;

INSERT INTO produto (nome_produto, preco, categoria, precisa_tamanho)
VALUES ('Camiseta Masculina', 84.90, 'roupa', true),
('Moletom Masculino', 104.90, 'roupa', true),
('Garrafa', 49.90, 'acessorio', false);

UPDATE produto SET NOME_PRODUTO = 'Moletom Feminino' WHERE id_produto = 2;


-- ADICIONANDO IMAGENS
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Moletom-Feminino.png' WHERE (`id_produto` = '2');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Colar.png' WHERE (`id_produto` = '3');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Boné.png' WHERE (`id_produto` = '4');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Caneca.png' WHERE (`id_produto` = '5');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Ecobag.png' WHERE (`id_produto` = '7');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Chaveiro.png' WHERE (`id_produto` = '8');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Broche.png' WHERE (`id_produto` = '9');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Camiseta-Masculina.png' WHERE (`id_produto` = '20');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Moletom.png' WHERE (`id_produto` = '21');
UPDATE `db_entrelacos`.`PRODUTO` SET `imagem` = '/src/assets/img/Garrafa1.png' WHERE (`id_produto` = '22');
UPDATE PRODUTO SET nome_produto = 'Garrafa', 
imagem = '/src/assets/img/Garrafa2.png', 
preco = 49.90 WHERE (id_produto = 6);

UPDATE PRODUTO SET categoria = 'Acessórios' WHERE categoria = 'Acessório';
UPDATE PRODUTO SET categoria = 'Roupas' WHERE categoria = 'Roupa';




-- ADICIONANDO DESCRICAO
UPDATE `db_entrelacos`.`PRODUTO` SET `descricao` = 'Nossa camiseta feminina é muito mais do que uma peça de roupa — é uma forma de vestir propósito. Feita com malha 100% algodão, ela oferece conforto, leveza e um caimento que valoriza todos os estilos. Com estampa exclusiva que representa o amor e o respeito pelos animais, essa camiseta é perfeita para quem quer apoiar a causa animal com atitude e consciência. 
Ideal para o dia a dia ou para eventos de voluntariado, ela combina moda e impacto social. Ao adquirir esta camiseta, você contribui diretamente com projetos que cuidam, protegem e promovem o bem-estar dos animais.' WHERE (`id_produto` = '1');

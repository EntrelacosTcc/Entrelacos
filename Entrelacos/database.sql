-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema entrelacos
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema entrelacos
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_entrelacos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `db_entrelacos` ;

-- -----------------------------------------------------
-- Table `entrelacos`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `senha` VARCHAR(255) NULL DEFAULT NULL,
  `status_verificacao_email` TEXT NULL DEFAULT NULL,
  `data_nascimento` DATE NULL,
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`ong`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`ong` (
  `id_ong` INT NOT NULL AUTO_INCREMENT,
  `nome_ong` VARCHAR(100) NULL DEFAULT NULL,
  `perfil_oficial` INT NULL DEFAULT '0',
  `classificacao` VARCHAR(50) NULL,
  `resumo` TEXT(150) NULL,
  `nome_responsavel` VARCHAR(100) NULL,
  `cargo_responsavel` VARCHAR(100) NULL,
  `CNPJ` VARCHAR(14) NULL,
  `id_usuario` INT NULL,
  `descricao` TEXT NULL,
  PRIMARY KEY (`id_ong`),
  UNIQUE INDEX `nome_ong` (`nome_ong` ASC) VISIBLE,
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `id_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`post` (
  `id_post` INT NOT NULL AUTO_INCREMENT,
  `texto_post` TEXT NULL DEFAULT NULL,
  `decoracao` VARCHAR(45) NULL,
  `imagem_url` TEXT NULL,
  `id_ong` INT NULL,
  PRIMARY KEY (`id_post`),
  INDEX `id_ong_idx` (`id_ong` ASC) VISIBLE,
  CONSTRAINT `id_ong`
    FOREIGN KEY (`id_ong`)
    REFERENCES `db_entrelacos`.`ong` (`id_ong`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`comentario` (
  `id_comentario` INT NOT NULL AUTO_INCREMENT,
  `texto` TEXT NULL DEFAULT NULL,
  `id_post` INT NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_comentario`),
  INDEX `id_post_idx` (`id_post` ASC) VISIBLE,
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `id_post`
    FOREIGN KEY (`id_post`)
    REFERENCES `entrelacos`.`post` (`id_post`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`avaliacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`avaliacao` (
  `id_avaliacao` INT NOT NULL AUTO_INCREMENT,
  `nota` INT NULL DEFAULT NULL,
  `data_avaliacao` DATETIME NULL DEFAULT NULL,
  `id_comentario` INT NULL,
  PRIMARY KEY (`id_avaliacao`),
  INDEX `id_comentario_idx` (`id_comentario` ASC) VISIBLE,
  CONSTRAINT `id_comentario`
    FOREIGN KEY (`id_comentario`)
    REFERENCES `edb_ntrelacos`.`comentario` (`id_comentario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`contato`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`contato` (
  `id_contato` INT NOT NULL,
  `telefone` VARCHAR(11) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `website_url` VARCHAR(255) NULL DEFAULT NULL,
  `instagram` VARCHAR(20) NULL DEFAULT NULL,
  `id_ong` INT NULL,
  PRIMARY KEY (`id_contato`),
  INDEX `id_ong_idx` (`id_ong` ASC) VISIBLE,
    FOREIGN KEY (`id_ong`)
    REFERENCES `db_entrelacos`.`ong` (`id_ong`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`vaga`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`vaga` (
  `id_vaga` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NULL DEFAULT NULL,
  `visao_geral` VARCHAR(50) NULL DEFAULT NULL,
  `sobre_a_vaga` TEXT NULL,
  `status` VARCHAR(20) NULL DEFAULT NULL,
  `data_criacao` DATETIME NULL DEFAULT NULL,
  `imagem_url` VARCHAR(255) NULL,
  `formato_trabalho` VARCHAR(10) NULL,
  `tarefas_voluntario` VARCHAR(50) NULL,
  `requisitos` TEXT NULL DEFAULT NULL,
  `classificacao_etaria` VARCHAR(45) NULL,
  `horas` INT NULL,
  `id_usuario` INT NULL,
  `id_ong` INT NULL,
  PRIMARY KEY (`id_vaga`),
  UNIQUE INDEX `titulo` (`titulo` ASC) VISIBLE,
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `id_ong_idx` (`id_ong` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`id_ong`)
    REFERENCES `db_entrelacos`.`ong` (`id_ong`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`data` (
  `id_data` INT NOT NULL,
  `id_vaga` INT NULL DEFAULT NULL,
  `data` DATE NULL DEFAULT NULL,
  `horario_inicio` TIME NULL DEFAULT NULL,
  `horario_fim` TIME NULL DEFAULT NULL,
  `limite_vagas` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`id_data`),
  INDEX `id_vaga_idx` (`id_vaga` ASC) VISIBLE,
  CONSTRAINT `id_vaga`
    FOREIGN KEY (`id_vaga`)
    REFERENCES `db_entrelacos`.`vaga` (`id_vaga`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`doacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`doacao` (
  `id_doacao` INT NOT NULL AUTO_INCREMENT,
  `titulo_doacao` VARCHAR(150) NULL DEFAULT NULL,
  `descricao` TEXT(255) NULL DEFAULT NULL,
  `responsavel_pedido` VARCHAR(75) NULL,
  `status_doacao` VARCHAR(45) NULL,
  `id_usuario` INT NULL,
  `id_ong` INT NULL,
  PRIMARY KEY (`id_doacao`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `id_ong_idx` (`id_ong` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`id_ong`)
    REFERENCES `db_entrelacos`.`ong` (`id_ong`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`doacao_entrelacos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`doacao_entrelacos` (
  `id_doacao_entrelacos` INT NOT NULL,
  `nome_completo` VARCHAR(75) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `cpf` VARCHAR(11) NULL DEFAULT NULL,
  `telefone` VARCHAR(11) NULL DEFAULT NULL,
  `valor` INT NULL DEFAULT NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_doacao_entrelacos`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`faleconosco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`faleconosco` (
  `id_contato` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `telefone` VARCHAR(11) NULL DEFAULT NULL,
  `assunto` VARCHAR(100) NULL DEFAULT NULL,
  `mensagem` TEXT NULL DEFAULT NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_contato`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`pedido` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `status_pedido` VARCHAR(30) NULL DEFAULT NULL,
  `data_pedido` DATETIME NULL DEFAULT NULL,
  `total` INT NULL,
  `embalagem` VARCHAR(12) NULL,
  `numero_identificacao` VARCHAR(45) NULL,
  `status` VARCHAR(50) NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_pedido`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `nome_produto` VARCHAR(100) NULL DEFAULT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `preco` DECIMAL(10,2) NULL DEFAULT NULL,
  `estoque` INT NULL DEFAULT NULL,
  `imagem` TEXT(255) NULL,
  `categoria` VARCHAR(45) NULL,
  `ativo` VARCHAR(45) NULL,
  PRIMARY KEY (`id_produto`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`produto_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`produto_pedido` (
  `id_itens_pedido` INT NOT NULL,
  `id_pedido` INT NULL DEFAULT NULL,
  `id_produto` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_itens_pedido`),
  INDEX `id_pedido_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `id_produto_idx` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `id_pedido`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `db_entrelacos`.`pedido` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_produto`
    FOREIGN KEY (`id_produto`)
    REFERENCES `db_entrelacos`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`perfil_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`perfil_usuario` (
  `id_perfil_usuario` INT not null,
  `id_usuario` INT NULL DEFAULT NULL,
  `telefone` VARCHAR(11) NULL DEFAULT NULL,
  `tags` VARCHAR(50) NULL DEFAULT NULL,
  `horas_voluntariado` INT NULL DEFAULT NULL,
  `nome` VARCHAR(45) NULL DEFAULT NULL,
  `foto` VARCHAR(255) NULL DEFAULT NULL,
  `descricao` VARCHAR(1000) NULL DEFAULT NULL,
  `cpf` VARCHAR(11) NULL DEFAULT NULL,
  `atuacoes` INT NULL DEFAULT NULL,
  `n_itens_doados` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_perfil_usuario`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `entrelacos`.`cupom`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`cupom` (
  `id_cupom` INT NOT NULL,
  `codigo_cupom` VARCHAR(45) NULL,
  `valor_desconto` VARCHAR(20) NULL,
  `ativo` VARCHAR(45) NULL,
  `id_pedido` INT NULL,
  PRIMARY KEY (`id_cupom`),
  INDEX `id_pedido_idx` (`id_pedido` ASC) VISIBLE,
    FOREIGN KEY (`id_pedido`)
    REFERENCES `db_entrelacos`.`pedido` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`entrega` (
  `id_entrega` INT NOT NULL,
  `cep` VARCHAR(8) NULL,
  `rua` VARCHAR(100) NULL,
  `numero` INT NULL,
  `complemento` VARCHAR(45) NULL,
  `bairro` VARCHAR(40) NULL,
  `cidade` VARCHAR(75) NULL,
  `estado` VARCHAR(40) NULL,
  `ponto_referencia` VARCHAR(75) NULL,
  `id_pedido` INT NULL,
  PRIMARY KEY (`id_entrega`),
  INDEX `id_usuario_idx` (`id_pedido` ASC) VISIBLE,
    FOREIGN KEY (`id_pedido`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`frete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`frete` (
  `id_frete` INT NOT NULL,
  `tipo` VARCHAR(45) NULL,
  `valor` VARCHAR(45) NULL,
  `id_pedido` INT NULL,
  `id_entrega` INT NULL,
  PRIMARY KEY (`id_frete`),
  INDEX `id_entrega_idx` (`id_entrega` ASC) VISIBLE,
  CONSTRAINT `id_entrega`
    FOREIGN KEY (`id_entrega`)
    REFERENCES `db_entrelacos`.`entrega` (`id_entrega`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`causa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`causa` (
  `id_causa` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  PRIMARY KEY (`id_causa`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`vaga_causa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`vaga_causa` (
  `id_vaga_causa` INT NOT NULL,
  `id_vaga` INT NULL,
  `id_causa` INT NULL,
  `vaga_causacol` VARCHAR(45) NULL,
  PRIMARY KEY (`id_vaga_causa`),
  INDEX `id_vaga_idx` (`id_vaga` ASC) VISIBLE,
  INDEX `id_causa_idx` (`id_causa` ASC) VISIBLE,
    FOREIGN KEY (`id_vaga`)
    REFERENCES `db_entrelacos`.`vaga` (`id_vaga`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_causa`
    FOREIGN KEY (`id_causa`)
    REFERENCES `db_entrelacos`.`causa` (`id_causa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`pontual`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`pontual` (
  `id_pontual` INT NOT NULL,
  `id_cargahoraria` INT NULL,
  `id_data` INT NULL,
  PRIMARY KEY (`id_pontual`),
  INDEX `id_data_idx` (`id_data` ASC) VISIBLE,
  CONSTRAINT `id_data`
    FOREIGN KEY (`id_data`)
    REFERENCES `db_entrelacos`.`data` (`id_data`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`multidatas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`multidatas` (
  `id_multidatas` INT NOT NULL,
  `id_cargahoraria` INT NULL,
  `id_data` INT NULL,
  PRIMARY KEY (`id_multidatas`),
  INDEX `id_data_idx` (`id_data` ASC) VISIBLE,
    FOREIGN KEY (`id_data`)
    REFERENCES `db_entrelacos`.`data` (`id_data`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`recorrente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`recorrente` (
  `id_recorrente` INT NOT NULL,
  `id_frequencia` INT NULL,
  `id_cargahoraria` INT NULL,
  `id_data` INT NULL,
  PRIMARY KEY (`id_recorrente`),
  INDEX `id_data_idx` (`id_data` ASC) VISIBLE,
    FOREIGN KEY (`id_data`)
    REFERENCES `db_entrelacos`.`data` (`id_data`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`certificados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`certificados` (
  `id_certificados` INT NOT NULL,
  `id_perfi_usuario` INT NULL,
  PRIMARY KEY (`id_certificados`),
  INDEX `id_perfi_usuario_idx` (`id_perfi_usuario` ASC) VISIBLE,
  CONSTRAINT `id_perfi_usuario`
    FOREIGN KEY (`id_perfi_usuario`)
    REFERENCES `db_entrelacos`.`perfil_usuario` (`id_perfil_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`itens_doacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`itens_doacao` (
  `id_itens_doacao` INT NOT NULL,
  `nome_doacao` VARCHAR(45) NULL,
  `quantidade` DECIMAL(10,0) NULL,
  `tipo` VARCHAR(45) NULL,
  `nome_doador` VARCHAR(45) NULL,
  `id_doacao` INT NULL,
  PRIMARY KEY (`id_itens_doacao`),
  INDEX `id_doacao_idx` (`id_doacao` ASC) VISIBLE,
  CONSTRAINT `id_doacao`
    FOREIGN KEY (`id_doacao`)
    REFERENCES `db_entrelacos`.`doacao` (`id_doacao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`cartao_credito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`cartao_credito` (
  `id_cartao_credito` INT NOT NULL,
  `numero_cartao` VARCHAR(20) NULL,
  `nome_cartao` VARCHAR(45) NULL,
  `vencimento` DATE NULL,
  `codigo_seguranca` INT NULL,
  `parcelas` VARCHAR(20) NULL,
  `juros` VARCHAR(45) NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_cartao_credito`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`pix`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`pix` (
  `id_pix` INT NOT NULL,
  `data_hora` DATETIME NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_pix`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`boleto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`boleto` (
  `id_boleto` INT NOT NULL,
  `codigo_barras` VARCHAR(100) NULL,
  `data_vencimento` DATE NULL,
  `data_emissao` DATE NULL,
  `id_usuario` INT NULL,
  PRIMARY KEY (`id_boleto`),
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`)
    REFERENCES `db_entrelacos`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `entrelacos`.`patrocinador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_entrelacos`.`patrocinador` (
  `id_patrocinador` INT NOT NULL,
  `nome_completo` VARCHAR(75) NULL,
  `cargo` VARCHAR(45) NULL,
  `nome_empresa` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `telefone` VARCHAR(11) NULL,
  `mensagem` TEXT(255) NULL,
  PRIMARY KEY (`id_patrocinador`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;



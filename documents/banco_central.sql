-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/12/2024 às 23:49
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `banco_central`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `bancos`
--

CREATE TABLE `bancos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `url_api` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `bancos`
--

INSERT INTO `bancos` (`id`, `nome`, `url_api`, `token`) VALUES
(1, 'Banco 1', 'http://localhost:5001/', 'TOKENBANCO1'),
(2, 'Banco 2', 'http://localhost:5002/', 'TOKENBANCO2');

-- --------------------------------------------------------

--
-- Estrutura para tabela `chaves_pix`
--

CREATE TABLE `chaves_pix` (
  `id` int(11) NOT NULL,
  `banco_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `chave` varchar(255) NOT NULL,
  `tipo` enum('CPF','CNPJ','EMAIL','TELEFONE','ALEATORIA') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `chaves_pix`
--

INSERT INTO `chaves_pix` (`id`, `banco_id`, `cliente_id`, `chave`, `tipo`) VALUES
(1, 1, 0, '12345678901', 'CPF'),
(2, 2, 0, 'luydi@email.com', 'EMAIL'),
(3, 2, 0, '091238123123', 'CPF'),
(5, 2, 0, '9901832981231', 'CPF'),
(7, 2, 0, '8374932874892', 'CPF'),
(8, 2, 0, '85675765675', 'CPF'),
(9, 2, 1, '878787878787', 'CPF');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `bancos`
--
ALTER TABLE `bancos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Índices de tabela `chaves_pix`
--
ALTER TABLE `chaves_pix`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chave` (`chave`),
  ADD KEY `banco_id` (`banco_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `bancos`
--
ALTER TABLE `bancos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `chaves_pix`
--
ALTER TABLE `chaves_pix`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `chaves_pix`
--
ALTER TABLE `chaves_pix`
  ADD CONSTRAINT `chaves_pix_ibfk_1` FOREIGN KEY (`banco_id`) REFERENCES `bancos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

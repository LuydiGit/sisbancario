# sisbancario

Discente: Luydi Matheu Bentes Sousa
Disciplina: Sistemas Distribuídos

Sistema bancário de PIX
Documento de Visão

1.  Introdução
    Este projeto tem como objetivo a criação de um sistema distribuído de transações financeiras via PIX, que simula a comunicação entre bancos e um banco central, ilustrando o funcionamento de APIs bancárias em um contexto prático. O sistema será utilizado em uma disciplina de Sistemas Distribuídos, focando em demonstrar a interação entre sistemas através de APIs com operações de registro, consulta e transferência de fundos entre contas.
2.  Objetivos do Sistema

    • Simular um sistema bancário para transferências instantâneas entre contas por meio de PIX, com múltiplos bancos e clientes.

    • Ensinar o conceito de comunicação entre APIs em um ambiente distribuído.

    • Exibir operações como controle de chaves PIX, registro de contas e usuários, saldo e extrato.

    • Demonstrar o fluxo de comunicação entre clientes, bancos e um banco central para garantir a segurança e integridade das transações.

3.  Escopo do Projeto
    O projeto contará com três componentes principais:
4.  API Banco Central - Controla a gestão de chaves PIX e a comunicação com os bancos.
5.  API Banco - Realiza operações financeiras e gerencia a comunicação com o banco central e os clientes.
6.  App Cliente - Interface de usuário para cadastro e operações bancárias (saldo, extrato, transferências).
    O sistema será desenvolvido com React para a interface do cliente e Node.js para o back-end das APIs. A implementação será focada na simulação de operações de transferência e na comunicação entre os serviços para garantir que a transação ocorra corretamente.
7.  Visão Geral dos Usuários:

    • Clientes - Pessoas físicas que utilizam o App Cliente para acessar serviços bancários, como consultas de saldo, extrato e transferências PIX.

    • Bancos - Entidades financeiras que utilizam a API Banco para fornecer serviços aos clientes e realizar interações com o banco central.

    • Banco Central - Entidade central que gerencia as chaves PIX e mantém o controle de bancos autorizados para garantir a integridade das transações.

8.  Requisitos Funcionais

RF1 Cadastro de Usuários

Permitir que o cliente cadastre-se no sistema, criando uma conta no banco.

RF2 Consulta de Saldo

O cliente deve poder consultar o saldo atual da conta.

RF3 Extrato Bancário

O cliente deve poder acessar o extrato das transações realizadas.

RF4 Cadastro de Chave PIX

Permitir que o cliente registre uma chave PIX vinculada à sua conta no banco.

RF5 Listagem de Chaves PIX

O cliente deve visualizar todas as chaves PIX cadastradas em sua conta.

RF6 Exclusão de Chave PIX

O cliente pode excluir uma chave PIX vinculada à sua conta.

RF7 Transferência via PIX

Permitir que o cliente realize transferências via PIX para outras contas usando a chave PIX.

RF8 Controle de Chaves PIX (Banco Central)

A API Banco Central deve permitir o registro e consulta de chaves PIX de cada cliente registrado pelos bancos.

RF9 Interação entre API Banco e Banco Central

Cada banco deve se comunicar com a API Banco Central para validar e autorizar as transações de PIX entre contas.

RF10 Simulação de Múltiplos Bancos e Clientes

O sistema deve suportar a existência de duas ou mais instâncias do App Cliente e da API Banco para testar as transações entre bancos diferentes.

7. Diagrama de Componentes

![alt text](/documents/diagramaDeComponetes.png)

8. Para o executar na sua máquina é necessário a instalação dos seguintes:
    8.1 Nodejs
    8.2 Npm
    8.3 Xaamp

9. Banco de dados:

    Encontrar na pasta documents -> banco de dados:

    9.1 banco_1;

    9.2 banco_2;
    
    9.3 banco_3;

10. Tutorial de como executar na sua máquia: 
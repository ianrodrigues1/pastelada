@echo off
chcp 65001 > nul
title Pastelada - Inicializador do Sistema

echo ==============================================================================
echo                 PASTELADA - SISTEMA DE PEDIDOS & ADMIN
echo                             Hortolândia - SP
echo ==============================================================================
echo.

:: Verificar se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] O Node.js não foi encontrado no seu computador!
    echo Para rodar o sistema, baixe e instale a versão LTS gratuita do Node.js:
    echo Acesse: https://nodejs.org/
    echo.
    echo Pressione qualquer tecla para fechar...
    pause > nul
    exit /b
)

:: Copiar arquivo de configuração .env caso não exista
if not exist .env (
    echo [INFO] Criando arquivo .env a partir de .env.example...
    copy .env.example .env > nul
)

:: Instalar dependências se a pasta node_modules não existir
if not exist node_modules (
    echo [INFO] Primeira execução detectada! Instalando dependências necessárias...
    echo (Isso pode demorar de 1 a 2 minutos apenas na primeira vez)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependências. Verifique sua conexão com a internet.
        pause
        exit /b
    )
)

echo.
echo ==============================================================================
echo [SUCESSO] Iniciando o servidor do Pastelada...
echo O sistema abrirá automaticamente no seu navegador em: http://localhost:3000
echo Para encerrar o sistema, basta fechar esta janela.
echo ==============================================================================
echo.

:: Abrir navegador automaticamente após 3 segundos
start "" "http://localhost:3000"

:: Iniciar o servidor de desenvolvimento
call npm run dev

pause

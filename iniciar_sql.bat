@echo off
chcp 65001 >nul
echo ========================================================
echo    INICIALIZANDO SERVIÇOS DO SQL SERVER (SQLEXPRESS)
echo ========================================================
echo.
echo 1. Habilitando e iniciando SQL Browser...
sc config SQLBrowser start= auto
net start SQLBrowser

echo 2. Iniciando SQL Server (SQLEXPRESS)...
net start "MSSQL$SQLEXPRESS"

echo.
echo ========================================================
echo   Verificando status dos serviços:
echo ========================================================
sc query "MSSQL$SQLEXPRESS" | findstr "STATE"
sc query "SQLBrowser" | findstr "STATE"
echo.
echo Tudo pronto! Pressione qualquer tecla para fechar.
pause


@echo off

SET CUR_DIR=%~dp0
ECHO %CUR_DIR%


cd %CUR_DIR%/Auth
call docker build -t nghilt19411/auth .
call docker push nghilt19411/auth

cd .. 

cd %CUR_DIR%/Client
call docker build -t nghilt19411/client .
call docker push nghilt19411/client

cd %CUR_DIR%/Tickets
call docker build -t nghilt19411/tickets .
call docker push nghilt19411/tickets
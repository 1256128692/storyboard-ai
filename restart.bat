@echo off

REM 清理占用 8081 端口的进程
echo 清理占用 8081 端口的进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    taskkill /F /PID %%a
)

REM 启动后端服务
echo 启动后端服务...
cd backend
mvn spring-boot:run
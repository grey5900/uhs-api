@ECHO OFF
md D:\backup\%date:~0,4%-%date:~5,2%-%date:~8,2%\%time:~0,2%-%time:~3,2%
mongodump -d uhs -o D:\backup\%date:~0,4%-%date:~5,2%-%date:~8,2%\%time:~0,2%-%time:~3,2%

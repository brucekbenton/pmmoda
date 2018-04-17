# pmmoda
Model Based Estimation Tool application

This code represents a Model BAsed Estimation project implemented by me. The application is a thin client UI implemented primarily in JavaScript, 
WebAPI (Controller and Models) implemented in C# and hosted on an IIS web server and the DDL scripts for the SQL server tables and procedures. 
Currently, this project does not include creation scripts for the database itself so that has to be created manually

Structure
Documentation - Contains basic overview information about Model BAsed Effort Estimation (MB2E) as well as the pmmoda application
pmoda_Alpha - Contains the Visual Studio project for the base application. Review the Controllers and Models sub-folders to understand the basic web service layer and the supported end points
SQL Scripts - Contains DDL scripts for the background tables and stored procedures. All Web Service reads are via stored procedures

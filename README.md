# IPL-SQL

## SQL/Postgres using IPL Project
----------------------------------------
## Introduction
 The goal of the project is to provide solutions to the following questions.
 1. Number of matches played per year for all the years in IPL
2. Number of matches won per team per year in IPL
3. Extra runs conceded per team in the year 2016
4. Top 10 economical bowlers in the year 2015

Download the required data from [Kaggle](https://www.kaggle.com/manasgarg/ipl).

Create a normalized postgres database of the downloaded data.

## Demo
![ Demo of hosted web page](https://github.com/mountblue/mbc-js-16-1-ipl-sql-Thushar12E45/blob/main/util/demo.gif)
## Install
1. Install Node

 ```
    https://nodejs.org/en/download/
```
2. Install PostgreSQL
```
https://www.postgresql.org/download/linux/ubuntu/
```
3. Clone this repository

```
   git clone https://github.com/mountblue/mbc-js-16-1-ipl-sql-Thushar12E45.git
```
4. Install npm packages
``` 
   npm install 
```

5. Create a .env file in your root directory and add your database configuration in the format given below 

```
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=ipl
   DB_PASS= abc@123
   DB_PORT= 5432
```
6. Create the Database
``` 
   node parse.js
```
7. Run project
```
   npm start
```

## Technologies Used

- JavaScript
- [Handlebars](https://handlebarsjs.com/guide/)
- CSS
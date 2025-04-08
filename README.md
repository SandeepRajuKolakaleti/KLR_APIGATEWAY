# General Information

## Start Commands for docker-compose file and information
Builds, (re)creates, starts, and attaches to containers for a service.  
`docker-compose up`  
Information:   
- Database can be accessed with PG-Admin via `localhost:5050` and then connect your database (see youtube playlist)
- NestJS Api can be accessed on `localhost:8080/api` (see youtube playlist)
  
# Concept of the series:

# You need the installed tools
- NPM
- Node.js
- NestJS
- Docker

# Basic Commands for Docker
Basic Docker Commands:  
List your docker images: `docker images`  
List your running containers: `docker ps`  
List also stopped containers: `docker ps -a`
Kill a running container: `docker kill <id of container from docker ps (first 3 letters)>`, eg `docker kill fea`  

#DB configuration:
    mysql: 
	   app.module.ts
		host: 'localhost',
		port: 3306,
		username: 'root',
		password: '',
		database: 'apigate'

#Installation:
npm install

#Run server:
npm start

# Mailer Intigration:

Minimize Security Constrains
https://myaccount.google.com/lesssecureapps

 nodemailer.createTransport({
    service:'gmail',
  auth: {
    type:'login', // default 
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

# SMS OTP
https://www.youtube.com/watch?v=MvUdqXI-s7g

docker network create api-service-net
docker-compose up --build


# run nodemon server
npm run start:dev

# debug
go to Run and debug and select
Run Script:debug
click on play button

# Redis

docker exec -it rdb redis-cli in cmd
get localtoken

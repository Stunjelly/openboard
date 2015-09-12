# Openboard

Real time KPI dashboards designed as a free Geckoboard alternative for Microsoft networks. 
Uses Windows Challenge/Response (NTLM) for authentication and a MySQL database.

Node.js, MySQL, AngularJS, WebSockets, LESS, Grunt

## Installation

```
npm install
bower install
grunt build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Client

The front end is powered by AngularJS. Grunt builds the production code into `./public/dist`, during development 
express will always route static content to `./public`.

## Setting up environment

Create a `.env` file in the root and fill the example config below

```
MYSQL_DB=openboard
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASS=root
LDAP_DOMAIN=national
LDAP_CONTROLLER=ldap://national.example.gov.uk
```

# Openboard

Real time [KPI](https://en.wikipedia.org/wiki/Performance_indicator) dashboards designed as a free Geckoboard alternative for Microsoft networks. 
Uses Windows Challenge/Response ([NTLM](https://en.wikipedia.org/wiki/NT_LAN_Manager)) for authentication and a MySQL database.

[Node.js](https://nodejs.org/en/)
, MySQL ([Sequelize](http://docs.sequelizejs.com/en/latest/))
, [AngularJS](https://angularjs.org/)
, [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
, [LESS](http://lesscss.org/)
, [Grunt](http://gruntjs.com/)

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

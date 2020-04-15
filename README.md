# GTFS-Cartogram

Github page : https://sweng-group-24.github.io/GTFS-Cartogram/

**Pease read below for instructions of use**

# Instructions for utilisation


# Project Architecture
This project can be easily divided into a clear front end component which we deploy using GitHub pages and a back end component which involves a server deployed on Heroku (https://eu-cartomaps.herokuapp.com/) using NodeJS and the express module which communicates between our database and our Front End Application. There are also some scripts we utilised to both extract and sort the data we were interested in and place said data in the database.

# Front End Description

# Back End Description
Firstly we have our database which is hosted on MongoDB and contains two collections, the first being the data we extracted and the second being a sorted version of that data. The data was sorted to make it easier for the front end to implement real time udpdate for the application. The data was sorted using a very basic version of insertion sort, therefore the sorting is quite inefficient and slow, however once the data is in the database the script needs not to be run again. This same script (data-manipulator.js) can be utilsed to extract data for any other country's public transport system.

This database is hosted on a free Heroku server. This type of server goes to sleep pretty quickly so normally the first search in our app will take an extra few seconds as the server must first be woken. 

The server simply takes a station ID as a parameter through the URL, searches the database for the ID and returns what it finds.

It is written in Node.js and Express and its source code (minus sensitive data) can be found in the Backend folder. 


# Abstracts
To calculate how a current stop should be displaced use the following formula where:
 - time_i is the time from current stop to stop_i
 - time_a is the average time to each stop
 - distance_a is the average distance to each stop
 - distance_i is the distance from current stop to stop_i


<a href="https://www.codecogs.com/eqnedit.php?latex=\large&space;\frac{time_i}{time_a}&space;*\frac{distance_a}{distance_i}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\large&space;\frac{time_i}{time_a}&space;*\frac{distance_a}{distance_i}" title="\large \frac{time_i}{time_a} *\frac{distance_a}{distance_i}" /></a>

This will output a number >= 0. Eg. if 0.5 is the result then the distance between the current stop and stop_i should on the map should be halved.

Similarly if 2 is the result the distance should be doubled.

This number will then be used in the point dividing a line segment formula to generate the new point.

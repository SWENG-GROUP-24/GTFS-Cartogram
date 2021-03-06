# GTFS-Cartogram

Github page : https://sweng-group-24.github.io/GTFS-Cartogram/

**Pease read below for instructions of use**

# Instructions for utilisation
Simply Search for your start station in the search bar, after the application is done loading the visualisation will be displayed to the user. The red markers represent where the original stations were, while the green markers represent where the stations are based on our mathematical distortion based on time. The biggest red marker represents the start station. To see which station each marker represents simply hover over them on click on the marker. If the stations are shown it is because the user picked a Terminal station.


# Project Architecture
This project can be easily divided into a clear front end component which we deploy using GitHub pages and a back end component which involves a server deployed on Heroku (https://eu-cartomaps.herokuapp.com/) using NodeJS and the express module which communicates between our database and our Front End Application. There are also some scripts we utilised to both extract and sort the data we were interested in and place said data in the database.

# Front End Description
At the front end we used the open source Javascript library known as 'Leaflet' to display our mapping data. First and foremost, the raw data is taken and displayed on the map, the origin station is displayed in the form of an enlarged hollow white circle, and all the stations which can be reached via one hop from the origin are displayed as full red dots. Then we process the raw data using our formula specified below, new locations for each of the stations are determined based on the length of time it would take an individual to get there, taking into account either the current time and the soonest train to leave the origin station, or the time inputted and the soonest train to leave the origin station after that.

We used HTML, Sass and CSS to create some of the elements of our user interface. Firstly, we developed a functional search bar. We have designed this to show a small search icon, however, it expands when the user clicks on the icon and allows the user to enter a station that they would like to travel from. We then implemented a time input. If the user does not enter a time, our system bases the travel time off real time data. Alternatively if the user decides to enter a time he/she can choose a future time to travel from. Lastly, we have provided the user with a small information icon in the top right hand corner of our interface. If the user clicks on this icon they are taken to a new page which gives a brief outline of our project.

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

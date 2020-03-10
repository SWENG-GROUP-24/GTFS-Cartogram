# GTFS-Cartogram

Github page : https://sweng-group-24.github.io/GTFS-Cartogram/

To calculate how a current stop should be displaced use the following formula where:
 - time_i is the time from current stop to stop_i
 - time_a is the average time to each stop
 - distance_a is the average distance to each stop
 - distance_i is the distance from current stop to stop_i


<a href="https://www.codecogs.com/eqnedit.php?latex=\large&space;\frac{time_i}{time_a}&space;*\frac{distance_a}{distance_i}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\large&space;\frac{time_i}{time_a}&space;*\frac{distance_a}{distance_i}" title="\large \frac{time_i}{time_a} *\frac{distance_a}{distance_i}" /></a>

This will output a number >= 0. Eg. if 0.5 is the result then the distance between the current stop and stop_i should on the map should be halved.

Similarly if 2 is the result the distance should be doubled.

This number will then be used in the point dividing a line segment formula to generate the new point.

d3-fetch.v1.min.js 	- D3.js library# cs6242project
# Description:
The package cs6242project contains the code for NYC ride hailing optimization project which helps taxi drivers in NYC maximise their efficiency and profits while minimizing the chances of collision and accidents.
It contains the following directory structure:

```
+-- www
|   +-- d3-fetch.v1.min.js ( Fetch REST endpoints  )
|   +-- geojson2h3.js ( Convert Hex to GeoJSON )
|   +-- h3-js.js ( Convert lat/long coordinates to H3 and get nearest rings for visualization )
|   +-- index.css ( CSS stylesheet for the page )
|   +-- index.html ( Default HTML page with selection boxes and legends )
|   +-- proj.js ( interactive map visualization, heatmaps, markers and tooltip  )
|   +-- require.js ( Asynchronous Module Loading (AMD) for loading files )
|   +-- server.py( Python HTTP server )
+-- DataContent
|   +-- APIs
|       +-- taxidataapi 
|           +-- collision_counts.js ( Collision count REST API ) 
|           +-- dbconfig.js ( Node.js configuration to establish connection with AWS RDS MySQL database )
|           +-- pickup_collision_counts.js ( Combined pickup and collision counts REST API )
|           +-- taxi_pickup_counts.js ( Taxi pickup counts REST API )
|   +-- PIG
|           +-- pig-green-yellow-uber-taxiinfo.txt ( Merge various data files (green taxi, yello taxi, and Uber) into one file )
|           +-- pig-script-collision-counts.txt ( Group by day of week, hour of day, and H3 zone to obtain collision counts )
|           +-- pig-script-groupby-latlon.txt ( Group by count latitude,longitude,weekday,hour, and h3 )
|           +-- pig-script-groupby.txt 	            - ??
|           +-- pig-script-pickup-groupby-latlong-weekday-hour.txt ( Group by taxi pickup count by weekday, hour, and lat-long )
|           +-- pig-script-pred.txt ( Generates the input data for ML algorithm )
|           +-- pig-script-pred_normalize.txt ( Clean, pre-process, subset and normalized data for ML algorithm )
|           +-- pig-script-pred_rmdup.txt 	        - ??
|           +-- price_average pig logs.txt ( Log file AWS EMR pig job run for average trip price )
|           +-- taxi_info_data_extraction_pig_logs.txt ( Log file AWS EMR pig job run )
```
# Setup:

Setup AWS EMR

Setup ML studio

Setup Node.js APIs in AWS Lambda
 
# Execution:

This application uses responsive web design which allows compatibility between desktop and mobile firefox browser.

1. Start python server using below command
    python server.py
2. For desktop/laptop, open the browser and enter the URL http://localhost:8080 
3. Alternatevely we have hosted the application in the URL http://ride-sharing-project.s3-website-us-east-1.amazonaws.com/

By default pickup heat map is shown around the dropped pin. The dropped pin can be moved around the map, and the heatmap follows. 
A click on the individual hexagonal cell opens up a tooltip containing historical information, and predicted information for 
pickup counts, probability of collision, and predicted average trip price. 

There're also option to focus on collision as well as combination of both collision and pickup. The prediction and historical information
provided in the tooltips are for the current day of the week, and hour of the day. However, there're dropdown to pick any specific day
of the week or hour of the day to get the information for a particular cell. Heatmaps and legends are changed accordingly. 

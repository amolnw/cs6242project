# Description:
The package cs6242project contains the code for NYC ride hailing optimization project which helps taxi drivers in NYC maximise their efficiency and profits while minimizing the chances of collision and accidents.
It contains the following directory structure:

```
+CODE
   |
   +---- www
   |           +-- d3-fetch.v1.min.js ( Fetch REST endpoints  )
   |           +-- geojson2h3.js ( Convert Hex to GeoJSON )
   |           +-- h3-js.js ( Convert lat/long coordinates to H3 and get nearest rings for visualization )
   |           +-- index.css ( CSS stylesheet for the page )
   |           +-- index.html ( Default HTML page with selection boxes and legends )
   |           +-- proj.js ( interactive map visualization, heatmaps, markers and tooltip  )
   |           +-- require.js ( Asynchronous Module Loading (AMD) for loading files )
   |           +-- server.py( Python HTTP server )
   +---- apis
   |           +-- collision_counts.js ( Collision count REST API ) 
   |           +-- dbconfig.js ( Node.js configuration to establish connection with AWS RDS MySQL database )
   |           +-- pickup_collision_counts.js ( Combined pickup and collision counts REST API )
   |           +-- taxi_pickup_counts.js ( Taxi pickup counts REST API )
   |           +-- azure-ml-collision-counts.js ( Predicted Taxi collision counts REST API )
   |           +-- azure-ml-fareamount-counts.js ( Predicted fare amount REST API )
   |           +-- azure-ml-pickup-counts.js ( Predicted Taxi pickup counts REST API )
   |
   +---- pig
   |           +-- pig-green-yellow-uber-taxiinfo.txt ( Merge various data files (green taxi, yello taxi, and Uber) into one file )
   |           +-- pig-script-collision-counts.txt ( Group by day of week, hour of day, and H3 zone to obtain collision counts )
   |           +-- pig-script-groupby-latlon.txt ( Group by count latitude,longitude,weekday,hour, and h3 )
   |           +-- pig-script-groupby.txt ( Group by count latitude (rounded to 5 degits,longitude rounded to 5 degits,weekday,hour, and h3 )
   |           +-- pig-script-pickup-groupby-latlong-weekday-hour.txt ( Group by taxi pickup count by weekday, hour, and lat-long )
   |           +-- pig-script-pred.txt ( Generates the input fare amount data for ML prediction algorithm )
   |           +-- pig-script-pred_normalize.txt ( Clean,removed boundary condition data such as latitude <35 or >45 and longitude <-75 and >-70, pre-process, subset and normalized data for ML algorithm )
   |           +-- pig-script-pred_rmdup.txt (Removed invalid fareamounts)
   |           +-- price_average pig logs.txt ( Log file pig job run for average trip price )
   |           +-- taxi_info_data_extraction_pig_logs.txt ( Log file pig job run )
```
# Setup:

Setup AWS EMR or Local Hadoop

AWS setup

1. Login to AWS console and select/search for EMR
2. Select Create Cluster and enter Cluster information
3. Select Advanced Option 
4. In Software Configuration select "Hadoop" latest version and Pig version
5. Leave AWS Glue Data Catalog settings and Edit software settings with default settings
6. In the Add steps, select Step type as "Pig Program" and click "Configure"
7. In the Pig program enter pig program name, S3 location of the pig script, input as S3 datasets location and put a location in S3. Select terminate cluster in the Action Failure dropdown.
8. In the hardware configuration, select 1 master and 3 cores with "m4.large" with "Purchase OnDemand" option
9. In the General Options section, enter cluster name, uncheck terminate protection and debugging options. Leave other options as default
10. In the security, Options select or create EC2 key pair for logging into AWS EMR console from CLI. Select other options as default
11. Create the cluster.
12. Verify your results in S3 or review logs for further steps

Local Setup (Mac OS)

1. Install latest java version if don't have one
2. Install Hadoop and Pig (You can use ruby to install brew and use brew to install Hadoop and Pig)
3. Open a terminal window and verify Hadoop and Pig installed properly.
4. Please export commands to add Hadoop and Pig paths to work on a terminal or go to the installed location and run Hadoop and Pig to start CLI options to run Hadoop and Pig scripts
5. Go to Hadoop CLI and create folder using "hadoop fs -ls /user/basefoldername" and "hadoop fs -ls /user/basefoldername/workingfolder" for example "hadoop fs -ls  /user/sriramayyagari/" and hadoop fs -ls  /user/sriramayyagari/nyctaxidata"
6. Another option is you can create a shell script with all required Hadoop command that you need to run or repeat as you work through different operations using Pig (Please find sample Hadoop scripts commands such as moving folders, files, removing files, storing and merging files)
7. Create Pig scripts that you would like to run using pig scripts
8. To run locally use, "pig -x local" option and to run in Hadoop use "pig -x mapreduce" options
9. Run different commands provided or create your own script to run the pig scripts and data cleansing/extraction operations


Setup ML studio

1. Go to Azure ML Studio home page and log in into your account or create a new account if you don't have already one.
2. Once you login you will have options to create datasets create experiments, publish/deploy/access your webservices on the left navigation panel
3. Go to Data Sets option and create a new dataset. Select new (+ option at the left bottom) and click on "from local file" option. Upload the dataset you prepared using Hadoop and Pig operations
4. After creating the data set you can review or visualize dataset created.
5. Select "Experiments" on the left navigation panel" and select "New (+)". 
6. Select New experiment. Please follow below instructions for "Predicting fare amount" model 
 Predicting fare amount
  i) Select the dataset and drag and drop in the dataset input option
  ii) Darg and drop below tasks in the experiment window
    "Select Column Dataset", "Missing Value Scrubber" (you can data cleaning in Hadoop to make there is no missing data), "Split Data", "Fast Forest Quantile Regression", "Tune Model Hyper Parameters", "Score Model", "Evaluate Model", "Cross-Validation Model"
  iii) In the Select Model please select "latitude, longitude, weekday,hour,fare_amount" elements
  iv) In the missing value scrubber select "remove entire row"
  v) In the Split data "Fraction of rows.." as 0.9 and 0.1 (Train and Test data spit)
  vi) In the fast forest quantile regression select "16,32,64" for "Max number of leaves per tree", "Maximum number of trees during training creation". Select "1,5,10" for "Minimum number of cases required to form leave". Select "0.25,0.5,075" "bagging fraction" 
  vii) Select Run/Setup as WebService/Run (Webservice Model) and Deploy Webservice to create APIs to call from different clients.
  viii) Experiment these value to make sure you have good results
 Predicting collision-prone zones
  i)
  ii)
  iii)

Setup Node.js APIs in AWS Lambda
 1) You can use any IDE to create node.js scripts
 2) We used npm install packages and used node to create node.js scripts and deploy node.js packages into AWS Lambda container to create APIs
 3) Install npm, node (https://nodejs.org/). Verify npm and node install correctly
 4) Install additional packages to connect to MySQL and external APIs (Azure ML APIs) by running "npm -save install mysql" and "npm -save install 
 5) Login to AWS or create AWS account and login to AWS console
 6) Search for "RDS" in the AWS console and select create database. In the select engine, select "Only enable options eligible for RDS Free Usage Tier" at the bottom and select MySQL database and click next
 7) In the Specify database details section select DB instance class as "db.t2.micro", enter DB instance identifier, master username, password and leave all other with dafault values
 8) In the network & security options, enter Database option, 'Database name" and leave all other with default values. Click on create database
 9. In the databases, you will find the newly created database and click on the database name
 10. In the "Connectivity & security" section, note you database endpoint name and select on the VPC secuirty groups link (starts with sg-****)
 11. In the security group details, select Inbound tab (at the bottom of the page), click edit and select "Add Rule". Select "Mysql/Aurora" and in the source section select "My IP" and save the rule.
 12. Install "MySQLWorkBench" application. Create new "MySQLConnection". Enter connection name, hostname with "Database Endpoint in AWS", database username and password for RDS MySQL Database created. Select "Test Connection" and verify everything is working fine.
 13. Create the database
 14. Once you have downloaded MySQL workbench, you can create database schema and tables and upload the datasets into the database.
 15. In the NodeJS create dbconfig.js script to establish connectivity to MySQL by defining connection configuration.
 16. Create NodeJS scripts to connect to MySQL database and retrieve results for different use cases and return the results in the response object through callback functions.
 17. Zip all packages and files in the nodejs project folder structure. Example zip command in MacOS nodejs folder is "zip taxiapis.zip -r collision_counts.js pickup_collision_counts.js taxi_pickup_counts.js dbconfig.js azure-ml-collision-counts.js taxi_pickup_counts.js azure-ml-fareamount-counts.js node_modules"
 18. Login in AWS Console and search for Lambda function and click on "Create Function" to create lambda function. Enter details of the lambda function.
 19. In the Function Code section "select Upload zip" file option to upload the previously created zip package.
 20.In the VPC section "Select Default VPC" for any node.js scripts connecting to MySQL and "NoVPC" for connecting to Azure ML APIs". Select all subnets and security group role that has RDS ACESS rights.
 21. Click on SAVE link at the top and click a test use case by selecting "Configuration test Events" drop down.  Test you Lambda function to make sure working fine
 22. Search for "API Gateway" in the AWS console and create API gateway. In the Create API section enter API name and create API. In the integration wizard select "Lambda function" as option and enter Lambda function name and create API. In the resources section create a resource example "taxicollisioncounts" and create method "Post". Enable "CORS" option and deploy the API option from drop down. Create a new staging area and deploy the API. In the staging area you will the API resource with method names and endpoints to invoke the API. There is a test API option and you can test the input JSON information verify API is working fine. 

# Execution:

This application uses responsive web design which allows compatibility between desktop and mobile firefox browser.

1. Start python server using below command
    python server.py
2. For desktop/laptop, open the browser and enter the URL http://localhost:8080 
3. Alternatevily we have hosted the application in the URL http://ride-sharing-project.s3-website-us-east-1.amazonaws.com/

By default pickup heat map is shown around the dropped pin. The dropped pin can be moved around the map, and the heatmap follows. 
A click on the individual hexagonal cell opens up a tooltip containing historical information, and predicted information for 
pickup counts, probability of collision, and predicted average trip price. 

There're also option to focus on collision as well as combination of both collision and pickup. The prediction and historical information provided in the tooltip are for the current day of the week, and hour of the day. However, there're dropdown to pick any specific day of the week or hour of the day to get the information for a particular cell. Heatmaps and legends are changed accordingly. 

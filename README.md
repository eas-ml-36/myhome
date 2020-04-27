Projec to learn how to connect dht11 sensor and smart meter to RPi and push readings to AWS IoT Core.
AWS IoT core pushes the messages to a dynamoDB. I built a website to query the dynamoDB and show the data is a couple
of graphs. To ensure only authenticated users get access I setup cognito. The website is hosted on AWS S3.
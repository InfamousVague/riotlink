[ ![Riotlink Logo-](http://i.imgur.com/GU5YtHH.png)](https://riotlink.net)

## Status:
[ ![Codeship Status for wski/riotlink](https://codeship.io/projects/ddbeb030-7d00-0132-124a-26d15d8e303d/status)](https://codeship.io/projects/42693)

## Setup:
Ensure that you have node and ruby sass installed on your web server.

Install global NPM packaged
> npm install -g bower forever grunt grunt-cli

Install dependancies
> npm install

Install clientside Dependancies
> bower install

Run our first build
> grunt

After grunt starts waiting exit and run
> forever start riotlink.js

Riotlink will start on localhost:5560

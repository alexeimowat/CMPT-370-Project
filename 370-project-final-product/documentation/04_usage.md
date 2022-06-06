# Running

This section concerns deploying the docker container, or running the project with Node. 

## Running the Docker Container

*Assuming the image has been built (see: [Setup](#Setup))*

Run:

```dockerfile
sudo docker run -p 3000:80 uplan
```

Now, the user can go to http://localhost:3000/ in a browser, to see the page running.

**Note**: If running successfully, your terminal running the Docker container will indicate the following:

```md
INFO: Accepting connections at http://localhost:80
```

This is not an error: ports are mapped (in the following command: ``3000:80``); view the page at ``http://localhost:3000/``, not ``http://localhost:80/``.

## Run the React Server

These steps concern running the project in development mode.

*This step assumes you have **installed node modules with ``npm install`` or ``yarn install`` already***.

Navigate to the ``react`` folder:
```shell_script
cd react
```

Run ``npm start`` or ``yarn start`` to run the app in the development mode; view it at [http://localhost:3000](http://localhost:3000) in a browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Run the Backend Server

The (still in development) way of running the backend is entirely through docker-compose.

The first step is to navigate to the newDjango directory and run the following commands:
To initilize the database:
```bash
sudo docker-compose run web python manage.py migrate
```
To get the data in the database: (this step will take awhile. If this crashes with an index out of range error then it still worked just not completly)
```bash
sudo docker-compose run web python manage.py loadData
```
To start the server:
```bash
sudo docker-compose up
```

## Stopping the Docker Container

Assuming the Docker container is currently running, the user can stop the container in one of two ways.

1. Press ^C (that is, CTRL + C) in the terminal running the container. Docker will indicate: ``INFO: Gracefully shutting down. Please wait...``.
2. In a *separate* terminal, perform the following:

See running Docker contains:
```shell script
docker ps
```

Find the column labelled ``IMAGE``, and the row with an ``IMAGE`` name of *uplan*. The right-most column, labelled ``NAMES`` will have a name that typically reads as <adjective_noun>. Identify this value, of the entry with an ``IMAGE`` name of *uplan*.

Run the following command, substituting <name> with the value identified in the previous step:
```shell script
docker stop <name>
```

The container should now be stopped.
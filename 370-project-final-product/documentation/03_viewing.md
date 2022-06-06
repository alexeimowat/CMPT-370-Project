# Viewing

This section outlines the process of preparing and running the project to view it; suitable for TAs, markers, presentations, etc.

## Requirements (Viewing)

The front-end is built on [React.js](https://reactjs.org/); therefore, you will need JavaScript enabled in your browser.

[Docker](https://docker.com/) is also required. 
* See [here](https://docs.docker.com/install/) for instructions getting Docker set up on your machine.
* To install on Ubuntu, see [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/).
 
## Setup (Viewing)

## Viewing Through the Virtual Machine

The steps described here do little more than set up port forwarding from your own machine to the Virtual Machine.

This is the simplest way to view the project. It is this convenient because the Virtual Machine is always running the server.

First set up port forwarding from your machine to tuxworld.
```shell script
ssh -N -f -L 3000:localhost:3000 nsid@tuxworld.usask.ca
```
Where "nsid" is replaced with your own nsid. For this command you will need to supply your university password to get into tuxworld.

Now enter tuxworld with
```shell script
ssh nsid@tuxworld.usask.ca
```
As before you will need to supply your university password to get into tuxworld.

Now we set up a port forward from tuxworld to the virtual machine with
```shell script
ssh -N -f -L 3000:localhost:3000 user@CMPT370g3.usask.ca
```
For this command you will need to supply the "user" password for the VM which can be seen either on our discord server, but will also be supplied to the markers of our project in a way that is to be determined.

Once again enter your university password to access tuxworld. Now that that is done you can access the website in your browser by going to ``localhost:3000``


### Clean Up
When you want to stop viewing the website you will find that port 3000 of localhost may be taken up. To stop that from happening you will need to stop the port forwards we set up before. This section describes who to do that.

First we close the port forward on your local machine to tuxworld. To do this we figure out the process id (PID) that our ssh command has. This is done with:
```shell script
ps aux | grep "ssh -N -f -L 3000:localhost:3000"
```
The process we want to stop is the one that matches most closely to the command we did above in the set up. Take note of the PID which is the second column of the output. Knowing that PID we kill it with
```shell script
kill PID
```

Now do the same thing with tuxworld. SSH into tuxworld like we've done before and do the same thing with
```shell script
ssh nsid@tuxworld.usask.ca
ps aux | grep "ssh -N -f -L 3000:localhost"
kill PID
```

With that we have shut down all the process we have created


## Viewing Without the Virtual Machine

Before the website is to be run, we will need to set a few things up with docker, and the database. To initialize docker, and do some minimal database set up, run:

```shell script
sudo docker-compose run web python manage.py migrate
```

If this is your first time running this command, then it will take some time to complete; this is because docker will need to set up the required images.

Next, we need to populate the database. Run the following command:
```shell script
sudo docker-compose run web python manage.py loadData
```

Since the database is rather large, this will also take some time to set up. 

**Note**" *If this command ends on an error, saying ``index out of range``, then it still worked.* 

If this process is interrupted, any changes made to the database can be undone by re-running the previous command, replacing ``loadData`` with ``deleteData``.

## Running (Viewing)

Once the database is initialized we can start all of the necessary servers with the following command:
```shell script
sudo docker-compose up
```

After this is done, the web-page can be accessed by opening the web-page ``localhost:3000`` in a browser.

**Note**: If running successfully, your terminal running the Docker container will indicate the following:

```md
INFO: Accepting connections at http://localhost:80
```

This is not an error: ports are mapped (in the following command: ``3000:80``); view the page at ``http://localhost:3000/``, not ``http://localhost:80/``.

### Stopping the Docker Container 

Assuming the Docker container is currently running, the user can stop the container by entering ^C (that is, CTRL + C) in the terminal running the container.
Docker will indicate: ``INFO: Gracefully shutting down. Please wait...``.


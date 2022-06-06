# *uPlan*, by Noēma

Term project done for CMPT 370 at the University of Saskatchewan.

Team Members:

- Kohlton Booth
- Braden Dubois
- Jenni Just
- Alex Mowat
- Martin Thingvold

# Table of Contents
[Requirements](#Requirements)

[Setup](#Setup)

[Running](#Running)

[Troubleshooting](#Troubleshooting)

[Documentation](#Documentation)

[Acknowledgements](#acknowledgements)

# Marker Setup

The steps described here do little more than set up port forwarding from your own machine to the Virtual Machine.

First enter tuxworld with
```shell script
ssh nsid@tux7.usask.ca
```

Now we set up a port forward from tuxworld to the virtual machine with
```shell script
ssh -N -f -L 3000:localhost:3000 user@CMPT370g3.usask.ca
ssh -N -f -L 8000:localhost:8000 user@CMPT370g3.usask.ca
```
These command might fail if someone else is port forwarding to tuxworld at the same time. This is most likely because someone in our project is already doing that however that's okay because it actually makes this step unnecessary!

Now exit away from tuxworld with ``exit`` and set up port forwarding from your machine to tuxworld.
```shell script
ssh -N -f -L 3000:localhost:3000 nsid@tux7.usask.ca
ssh -N -f -L 8000:localhost:8000 nsid@tux7.usask.ca
```
Where "nsid" is replaced with your own nsid. For this command you will need to supply your university password to get into tux7.

Once again enter your university password to access tuxworld. Now that that is done you can access the website in your browser by going to ``localhost:3000``


### Clean Up
This section stops the port forwards that we just set up.

First we close the port forward on your local machine to tuxworld. To do this we figure out the process id (PID) that our ssh command has. This is done with:
```shell script
ps aux | grep "ssh -N -f -L 3000:localhost:3000"
ps aux | grep "ssh -N -f -L 8000:localhost:8000"
```
The process we want to stop is the one that matches most closely to the command we did above in the set up. Take note of the PID which is the second column of the output. Knowing both of those PIDs we kill them with
```shell script
kill PID
```

Now SSH into tuxworld and do the same thing as above with the following. Note: If the first step of setting up the port forward failed then this is unnecessary, and potentially even **dangerous**. 
```shell script
ssh nsid@tuxworld.usask.ca
ps aux | grep "ssh -N -f -L 3000:localhost:3000"
ps aux | grep "ssh -N -f -L 8000:localhost:8000"
kill PID
```

With that we have shut down all the process we have created

# Setup

First, one must *clone* the project using [git](https://git-scm.com/); assuming ``git`` is installed on your system, run the following command: 

To view the project for the alpha, include the ``--branch milestone-8`` option. For development-mode, omit it.

```shell script
git clone --branch milestone-8 https://git.cs.usask.ca/brd171/370-project.git uplan 
```

Then, change your *working directory* to be the root of the project:

```shell script
cd uplan
```

## Viewing / Non-Developer

The following instructions are for viewing the product outside of development-mode; this is suitable for markers, TAs, customers/stakeholders, etc.

***Docker support is in development for the back-end and the container does not represent the project at present.***

Ensure you have Docker installed and operational on your system (see [here](https://docs.docker.com/install/)).

Docker:
### Starting Docker On Linux
You may need to *start* the Docker service; on Linux. If you're using OSX/Windows version of docker the service will be running in the background.
```shell script
sudo systemctl start docker.service
```

### Building the Docker Image

From the root of the project, run:

```dockerfile
sudo docker build . -t uplan
```

The image should be visible if the user now runs:

```dockerfile
sudo docker images
```

You are now ready to run the container and view the project! See [Running](#Running) to continue.

## Development

These instructions are for setting up the project for development.

### Installing Dependencies

To install ``node_modules``, navigate to the ``react`` folder:

```shell_script
cd react
```

Run ``sudo npm install`` or ``sudo yarn install`` to install necessary dependencies. This may take a while. The two are functionally equivalent, but ``yarn`` installs dependencies in parallel, and may be faster.

**You must install the node modules in order to run the project. If you have just cloned the project, you will *not* have them installed yet, and the project will not start until you install them!**

## Creating a Production Build

**This concerns creating a production/deployment-ready build, which cannot be further edited.**

Run ``npm run build`` or ``yarn build`` to build the app for production in the `build` folder.

It bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

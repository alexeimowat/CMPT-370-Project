# Troubleshooting

## Module Failure when trying to start docker

*Q*: After running ' sudo docker-compose up', I run into an error like:

```
react_1  | Failed to compile.
react_1  | 
react_1  | ./src/components/ClassSearcher/index.tsx
react_1  | Module not found: Can't resolve 'react-input-range' in '/app/frontend/src/components/ClassSearcher'
```

*A*: Reset the Containers and Volumes.

To reset the Containers use control 'C' to stop the current process and run the following command:

```
sudo docker-compose build
```

Then you can try to get docker up again with the commands:
```
sudo docker-compose run web python manage.py migrate
sudo docker-compose run web python manage.py loadData
sudo docker-compose up
```

If this does not work and you still run into the same error, you need to reset the Volumes as well

Leave the other command as is. DO NOT do control 'C' or anything that will exit the current process.
You'll know you haven't quit the current process if you have the following prompt (or something similar)

```
react_1  | 
```

Now open up a new terminal and type the following command in that terminal:

```
sudo docker-compose down -v
```

This should end the process in your first terminal and start running docker in the new terminal window. Now docker and the website should be up and running.


## 'npm install' Failure 

**Q**: After running 'npm install', I run into the error:

```npm WARN saveError ENOENT: no such file or directory, open '/home/jen/WebstormProjects/uPlan/package.json'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN enoent ENOENT: no such file or directory, open '/home/jen/WebstormProjects/uPlan/package.json'
npm WARN uPlan No description
npm WARN uPlan No repository field.
npm WARN uPlan No README data
npm WARN uPlan No license field.
```

**A**: Make sure you are in the react directory. Fix this with

```cd react
npm install```

## Incorrect host error

**Q**: After running 'npm start', I run into an error. 

**A**: Check to make sure your host environment is set to
If it is set to anything else (x86_64-conda_cos6-linux-gnu), use the following command to change your host environment.

```shell script
HOST='localhost'
```

When you run the command 'npm start' again you should see this as part of the console output:
```shell script
Attempting to bind to HOST environment variable: localhost
```

## Page-Edits Triggering Reload

**Q**: Changes I make are not appearing unless I restart the session?

**A**: Try reinstalling dependencies as follows:

```shell script
rm -rf node_modules/
npm install
```

Alternatively, if you are on Linux, you may need to [increase your inotify limit](https://confluence.jetbrains.com/display/IDEADEV/Inotify+Watches+Limit).

Open ``/etc/sysctl.conf`` (or create it, or make any file under ``/etc/sysctl.d/``  in a text-editor.  Add the following (or change the value if it's already there) to the file:

``
fs.inotify.max_user_watches = 524288
``

And apply the change:

``
sudo sysctl -p --system
``

Restart your IDE.

## Outdated Node Version

In the event that instead of a webpage appearing an error appears of the form "TypeError: Path must be a string. Received undefined" then the version of node must be changed.

The easiest way to do this is to install ``nvm`` and use that to change the node version. That is done with the following steps:
- Install nvm: ``curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash``
- Restart terminal
- To verify installation the command: ``command -v nvm`` should print out "nvm"
- Switch version: ``nvm install 10.10.0``

Once that is done run ``npm install`` and ``npm run`` again and it should work (in some cases it may ask you to download one more module. In that case simply pip install it then ``install`` and ``start`` one more time)

## TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. 

If you encounter this error, you can go to the package.json file in the 
project directory and find the ```react-scripts: 3.3.0``` and change
this value to ```3.4.0```. After changing this, you should re-run 
```npm install``` and it should fix this issue. 

## docker-compose: pair interfaces: operation not supported

If you encounter this error your .ko files in /usr/lib/modules/{KERNEL_VERSION} were deleted from an update
Restarting will give you the correct modules for your new kernel.

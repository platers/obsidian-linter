# Setting Up the Linter

You will want to start by forking this repository. Once that is done, you will want to clone your fork of the repository.
The command should look something like the following:

``` sh
git clone https://github.com/{USERNAME_HERE}/obsidian-linter/
```

## Node and NPM

Next you will want to install the appropriate versions of Node and NPM.  
_This plugin requires Node version `15.x` or higher._

### Windows

Install the version of [Node](https://nodejs.org/en/download/) you would like. Make sure to add it to your path under environment variables.

### Linux, Mac, and Windows via WSL/WSL2

It is recommended that you use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) which is a node version manager that comes in handy when swapping and installing node versions,
especially since most linux package managers do not have the needed node version in the standard packages.

## Install Dependencies

Now that Node and NPM are installed, we can go ahead and run `npm ci` from the base of the cloned repository.
This should install the necessary dependencies for working on the plugin. The command may take several minutes to complete.

Once this is done, you should be all set up for contributing to the plugin.

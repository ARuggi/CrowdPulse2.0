# Introduction

The software is divided into two macro-components, the "Frontend" package and the "Backend" package. Both will need to be launched at the same time to run correctly the software.
The Frontend component will be reachable at port 3000. The Backend component will be reachable at port 4000.

# Dependencies
MongoDB : 5.0 -
Node.js : 14.18.0 -
Npm : 6.14.15 


## Installation Frontend

Use the package manager [npm](https://www.npmjs.com/) to install the sofwtare.

```bash
cd frontend 
npm install
npm run build
# if run build fails due to permission denied
npm install react-scripts --save
```

## Installation Backend

Use the package manager [npm](https://www.npmjs.com/) to install the sofwtare.

```bash
cd backend 
npm install

```

## Run

```bash

# Start frontend 
cd frontend
npm start 

# Start backend 
cd backend
npm start 

```

## Forever Run
Use the [npm forever](https://www.npmjs.com/package/forever) to runs continuously the sofwtare.
```bash

# Start frontend 
cd frontend
sudo npm install forever -g
forever start -c "npm start" ./

# Start backend 
cd backend
sudo npm install forever -g
forever start -c "npm start" ./

```

## Test
The software is now reachable on http://localhost:3000/

## License
Software developed by Giovanni Tempesta and Phd. Cataldo Musto during the thesis project "
Design and Implementation of a Social Content Analytics platform " for the University of Bari (Uniba)
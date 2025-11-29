#! /bin/bash

npm install

npm run format
npm run lint:fix
npm test -- --run
npm run build
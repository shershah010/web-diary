trap 'kill %1; kill %2; kill %3' SIGINT
npm start --prefix ./frontend & npm start --prefix ./backend & python ./models/ml-server.py
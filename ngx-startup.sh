docker rm -f $(sudo docker ps -a -q)
 #$env:NODE_OPTIONS="--max-old-space-size=8192"
npm run build

echo copping dist folder
cp -r dist/app/ config/

echo going to config folder
cd config

echo build docker image
docker build -t app .

echo run docker image
#for local backend/Python server so that container can connnect to localhost network

docker run -p 7070:7070 --name app app



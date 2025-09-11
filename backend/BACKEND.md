# Backend

## Running a development environment:

1. Cd into the ```backend/docker-compose-dev``` directory and bring up dev containers

```
docker compose up -d
```

2. Cd into the ```backend/api``` directory and install dependencies:

```
npm install
```

3. Run migrations
```
npx knex migrate:latest
```

4. Run seeds
```
npx knex seed:run
```

5. Start the api server
```
npm start
```

6. Open docs at ```http://localhost:3001/docs```

## Get a clean slate after updates
If you've pulled new code changes from the backend, you can ensure your postgres instance is updated by doing the following:

1. From the ```backend/docker-compose-dev``` directory, bring down docker compose
```
docker compose down
```

2. Remove the postgres volume (you *may* need to run with sudo)
```
rm -rf pg-data
```

3. Bring docker compose back up
```
docker compose up -d
```

4. Run the the above steps to migrate an seed the database again

## ERD
![](../docs/ERD/ERD.svg)
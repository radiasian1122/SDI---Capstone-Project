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

## ERD
![](../docs/ERD/ERD.svg)
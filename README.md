# Exercise Tracker REST API

The API provides a way for users to store and retrieve the information about their exercise routine.

## Built with 

- Node
- Express
- Mongoose 
- MongoDB
- Postman 

### User Stories

1. I can create a new user by posting form data username to `/api/exercise/new-user`. An object with a username and unique id will be returned.

2. I can get an array of all users with their usernames and ids by getting `api/exercise/users`.

3. I can add an exercise to any user by posting form data user id, description, duration and optionally date to `/api/exercise/add`. If date is not supplied, the current date will be used. The user object with the added exercise fields will be returned.

4. I can retrieve a full exercise log of any user by getting `/api/exercise/log?userId=...` with a parameter of the unique user id. The user object with its exercise log and total exercise count will be returned.

5. I can retrieve a part of the log of any user by adding optional parameters to the query string - `/api/exercise/log?userId=...&from=...&to=...&limit...`. From and to are dates formatted like YYYY-MM-DD, limit is the maximum number of exercises returned from the server. 

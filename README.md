### Apollo server example

In Apollo official demo are run a simple server example by apollo server, but not suitable for production.

In production env should run server by express, lambda, koa ., etc.

This example are using express (apollo-server-express) to running local server.


### Install


```cmd
npm install
```

#### Start running Apollo server


```
nodemon server.js
```


#### Open browser - GraphQL IDE

After apollo local server is running, you can access Apollo GraphQL IDE on following link:

http://localhost:4000


#### Example 

Query librarys data

```graphql
query Libraries {
  libraries {
    branch
    books {
      title
      author {
        name
      }
    }
  }
}
```


### MongoDB as Data Source

Here are using the [mongoose](https://mongoosejs.com/docs/index.html) client, and can checkout this example in branch of **mongodb-as-data-source**.

About the data source can refer [apollo-datasource-mongodb](https://github.com/GraphQLGuide/apollo-datasource-mongodb/).

Before running in local, make sure you have mongodb excute and default connect as"mongodb://user:userpw@localhost:27017/apollo_example"

You can expore mongodb data with [MongoDB Conpass](https://www.mongodb.com/try/download/compass).

You can create additional users for this example deployment:

```cmd
use apollo_example
db.createUser({user:"user", pwd:"userpw", roles:[{role: "readWrite", db:"apollo_example"}]})
```

After create account and database, you can add one record to members collections:

```json
/** 
* Paste one or more documents here
*/
{
  "_id": {
    "$oid": "626e2ef3a39d88c7815c9fd4"
  },
  "name": "Adam",
  "age": 18  
}
```

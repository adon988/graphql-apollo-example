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
node server.js
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
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const { v4 } = require('uuid');
const { Member, Student } = require('./models/');
const Students  = require('./data-source/student');


// Schema
const typeDefs = gql`
  type Member {
    _id: ID!  # mongodb default id is _id
    name: String
    age: Int
  }
  type Student {
    _id: ID!  # mongodb default id is _id
    name: String
    age: Int
  }
  # Library > Book > Author
  type Library {
    branch: String!
    books: [Book!]
  }
  type Book {
    title: String
    author: Author!
  }
  type Author {
    name: String!
  }

  type Query {
    books: [Book]
  }
  type Score {
    name: String
    score: Float
}
type User {
    name: String
    age: Int
    hobbies: [String!]!
    scores: [Score]
}
type Article {
    id: ID!
    title: String!
    body: String!
    tagList: [String!]
}
type Query {
    cannotBeNull: String! 
    canBeNull: String
    hello: String
    foo: String
    count: Int
    user: User
    articles: [Article]
    article(id: ID!): Article 
    libraries: [Library]
    members: [Member!]
    member(id: ID!): Member!
    students: [Student!]
    student(id: ID!): Student!
}
input CreateArticleInput {
    title: String!
    body: String!
}
input UpdateArticleInput {
    title: String!
    body: String!
}

type DeleteionStatus {
    success: Boolean!
}
type Mutation {
    createArticle(article: CreateArticleInput): Article
    updateArticle(id: ID!, UpdateArticleInput: UpdateArticleInput): Article
    deleteArticle(id: ID!): DeleteionStatus
}
`;
const articles = [{
  id: '1',
  title: '文學作者',
  body: '擁有十年科學奇幻小說經驗'
}, {
  id: '2',
  title: 'title2', 
  body: 'body2'
}, {
  id: '3',
  title: 'title3', 
  body: 'body3'
}, {
  id: '4',
  title: 'title4', 
  body: 'body4'
}
];
const libraries = [
  {
    branch: 'downtown'
  },
  {
    branch: 'riverside'
  },
];
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown'
  },
];

// Query
const resolvers = {
    Query: {
      async members () {
        const members = await Member.find();
        return members;
      },
      async member (parent, { id }) {
        const member = await Member.findById( id );
        return member;
      },
      async students (parent, args, {dataSources }) {
        const students = await dataSources.students.getAll();//from data-source/student.js
        return students;
      },
      async student (parent, { id }, { dataSources }) {
        const student = await dataSources.students.get(id);//from data-source/student.js
        return student;
      },
      libraries() {
        return libraries;
      },
      article (parent, {id}, context, info) {
        // parent: parent are pervious resolve's resoult, parent will excute before current resolvers
        // args: graqhQL arguments
        // context: this params will recive the new ApolloServer.context return 
        // info: execution state info
        return articles.find(article => article.id === id);
      },
      books: () => books,
      cannotBeNull() { 
          return "cannot be null"; 
      },
      hello() {
          return 'Hello world asdfasdf!';
      },
      foo() {
          return 'bar';
      },
      count() {
          return 1;
      },
      user() {
          return {
                  name: 'Adam',
                  age: 38,
                  hobbies: ['basketball', 'watch movie'],
                  scores: [{name:"English", score: 73}, {name:"Chinese", score: 83}]
          }
      },
      articles() {
          return articles 
      },
    },
    //Following can define the schema's type filter to as query parent filter
    Library: {
      books(parent) {
        // Filter the hardcoded array of books to only include
        // books that are located at the correct branch
        return books.filter(book => book.branch === parent.branch);
      }
    },
    Book: {
      // The parent resolver (Library.books) returns an object with the
      // author's name in the "author" field. Return a JSON object containing
      // the name, because this field expects an object.
      author(parent) {
        return {
          name: parent.author
        };
      }
    },
    Mutation: {
      createArticle(parent, {article}, context, info) {
          article.id = v4();
          articles.push(article);
          return article;
      },
      updateArticle(_, {id, UpdateArticleInput: UpdateArticleInput}) {
          const article = articles.find(article => article.id === id);
          article.title = UpdateArticleInput.title;
          article.body = UpdateArticleInput.body;
          return article;
      },
      deleteArticle(_, {id}) {
          const index = articles.findIndex(article => article.id === id);
          console.log(index);
          articles.splice(index, 1);
          console.log(articles);
          return {
              success: true
          }
      }
    },
};




async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context (req) {
      //each GraphQL request will process inn here
      //The context function defined above is called once for every GraphQL operation that clients send to our server. The return value of this function becomes the context argument that's passed to every resolver that runs as part of that operation.

    },
    dataSources (){
      return {
        students: new Students(Student)
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
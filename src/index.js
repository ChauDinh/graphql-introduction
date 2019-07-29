const { ApolloServer, gql, PubSub } = require("apollo-server");

// The first part of the GraphQL is creating a schema or also known as typeDefs

const typeDefs = gql`
  type Query {
    hello(name: String!): String!
    user: User!
  }

  type User {
    id: Int!
    username: String
    firstLetterOfUsername: String
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    user: User!
    errors: [Error!]!
  }

  input UserInfo {
    username: String
    password: String!
    age: Int!
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
  }

  type Subscription {
    newUser: User!
  }
`;

const NEW_USER = "NEW_USER";

// Then, create a resolver
const resolvers = {
  User: {
    firstLetterOfUsername: parent => {
      return parent.username ? parent.username[0] : null;
    },
    username: parent => {
      return parent.username;
    }
  },

  Query: {
    hello: (parent, { name }, context, info) => {
      return name;
    },
    user: () => ({
      id: 2,
      username: "Bob2"
    })
  },
  Mutation: {
    register: (_, { userInfo: { username } }, { pubsub }) => {
      const user = {
        id: 1,
        username
      };
      pubsub.publish(NEW_USER, {
        newUser: user
      });
      return {
        user: {
          id: 1,
          username: "Bob"
        },
        errors: [
          {
            field: "username",
            message: "bad!"
          },
          {
            field: "username2",
            message: "bad2!"
          }
        ]
      };
    },
    login: async (parent, { userInfo: { username } }, context, info) => {
      // checking the password
      // await checkPassword(password);
      return username;
    }
  },

  Subscription: {
    newUser: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER)
    }
  }
};

const pubsub = new PubSub();

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
    pubsub
  })
});

server.listen().then(({ url }) => console.log("server is listenning at ", url));

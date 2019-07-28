const { ApolloServer, gql } = require("apollo-server");

// The first part of the GraphQL is creating a schema or also known as typeDefs

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    register: User
  }
`;

// Then, create a resolver
const resolvers = {
  Query: {
    hello: () => "Halo World!"
  }
};

// Create an instance of Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log("server is listenning at ", url));

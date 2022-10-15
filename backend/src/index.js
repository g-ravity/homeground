const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const resolvers = {
Query: {
    info: () => `This is a test query`,
    feed: () => async (parent, args, context) => {
        const allLinks = await  context.prisma.link.findMany()
        console.log({allLinks})
        return allLinks
    },
},
Mutation: {
    // 2
    post: async (parent, args, context, info) => {
        const newLink = await context.prisma.link.create({
            data: {
                url: args.url,
                description: args.description,
            },
        })
        console.log({newLink})
        return newLink
    },
},
}

const server = new ApolloServer({
typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
),
resolvers,
context: {
    prisma,
}
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
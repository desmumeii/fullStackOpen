const { GraphQLError } = require('graphql')
const Author = require('./models/authors')
const Book = require('./models/books')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = args.genre
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})

      const bookCounts = await Book.aggregate([
        {
          $group: {
            _id: "$author",
            count: { $sum: 1 },
          },
        },
      ])

      const countMap = {}
      bookCounts.forEach(b => {
        countMap[b._id.toString()] = b.count
      })

      return authors.map(author => ({
        ...author.toObject(),
        bookCount: countMap[author._id.toString()] || 0,
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: (root) => root.bookCount
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id, 
      })
      let populatedBook
      try {
        const savedBook = await book.save()
        populatedBook = await savedBook.populate('author')
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
      return populatedBook
    },
    editAuthor:  async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError(`Creating the user failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
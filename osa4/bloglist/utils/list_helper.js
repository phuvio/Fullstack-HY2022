const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const result = {
    max: 0,
    obj: {}
  }
  for (var i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > result.max) {
      result.max = blogs[i].likes
      result.obj = blogs[i]
    }
  }
  return {
    title: result.obj.title,
    author: result.obj.author,
    likes: result.obj.likes
  }
}

const mostBlogs = (blogs) => {
  const obj = {}
  for (var i = 0; i < blogs.length; i++) {
    if (!obj[blogs[i].author]) {
      obj[blogs[i].author] = 1
    } else if (obj[blogs[i].author]) {
      obj[blogs[i].author] += 1
    }
  }
  const keys = Object.keys(obj)
  let max = 0
  let result = {}
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] > max) {
      max = obj[keys[i]]
      result = {
        author: keys[i],
        blogs: max
      }
    }
  }
  return result
}

const mostLikes = (blogs) => {
  const obj = {}
  for (var i = 0; i < blogs.length; i++) {
    if (!obj[blogs[i].author]) {
      obj[blogs[i].author] = blogs[i].likes
    } else if (obj[blogs[i].author]) {
      obj[blogs[i].author] += blogs[i].likes
    }
  }
  const keys = Object.keys(obj)
  let max = 0
  let result = {}
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] > max) {
      max = obj[keys[i]]
      result = {
        author: keys[i],
        likes: max
      }
    }
  }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
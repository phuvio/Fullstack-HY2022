import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const changeVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="blog">
      {!visible && (
        <div>
          {blog.title} {blog.author} <button id='view-button' className="blogview" onClick={changeVisibility}>view</button>
        </div>
      )}
      {visible && (
        <div>
          {blog.title} {blog.author} <button className="blogview" onClick={changeVisibility}>hide</button>
          <br></br>
          {blog.url}
          <br></br>
          {blog.likes} <button id='like-button' onClick={() => updateBlog(blog)}>like</button>
          <br></br>
          {blog.user.name}
          <br></br>
          <button className='remove' onClick={() => removeBlog(blog)}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
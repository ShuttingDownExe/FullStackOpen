import {useState, useEffect} from 'react';
import blogService from './services/blogService';
import './styles/blogItem.css'

const BlogItem = ({ title, author, url, likes, summary, tags }) => {
  return (
    <div className="blog-card">
      <div className="blog-meta">
        <span className="blog-author">{author.name} • {author.title}</span>
        <span className="blog-likes">♥ {likes}</span>
      </div>
      <h2 className="blog-title">{title}</h2>
      {summary && <p className="blog-summary">"{summary}"</p>}
      <div className="blog-footer">
        <div className="blog-tags">
          {tags && tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <span className="read-more">Read Essay →</span>
      </div>
    </div>
  );
};    

const App = () => {
  const [blogItems, setBlogItems] = useState([])

  useEffect(()=> {
    var items = blogService.getAll().then(blogs => {
      setBlogItems(blogs)
    })
  },[])
  
  return(
    <>
      {blogItems.map(blog => 
        <BlogItem 
          key={blog.id}
          title={blog.title}
          author={blog.author}
          url={blog.url}
          likes={blog.likes}
          summary={blog.summary}
          tags={blog.tags}
        />
      )}
    </>
  )
}

export default App

const dummy = (blogs) => {
    return true
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
    const blogMaxLikes = blogs.reduce(
        (max, blog) => blog.likes > max.likes ? blog : max, blogs[0]
    );
    
    return blogMaxLikes;
}

module.exports = {
    dummy,
    totalLikes,
    mostLikes
}
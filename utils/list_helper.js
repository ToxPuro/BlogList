const _ = require('lodash')
const dummy = (blogs) =>{
    return 1
}

const totalLikes = (blogs) =>{
    const reducer = (sum, blog) =>{
        return sum + blog.likes 
    }
    return blogs.reduce(reducer,0)

}

const favoriteBlog = (blogs)=>{
    const empty = {
            _id: "empty",
            title: 'empty',
            author: 'empty',
            url: 'empty',
            likes: -1,
            __v: 0
    }
    const reducer = (max,blog)=>{
        if(max.likes>blog.likes){
            return max
        }
        return blog
    }
    if(blogs.reduce(reducer,empty)===empty){
        return null
    }
    return blogs.reduce(reducer,-1)
}

const mostBlogs = (blogs) =>{
    const returnAuthor= (blog) =>{
        return blog.author
    }
    let authors = _.countBy(blogs, returnAuthor)
    let max = -1
    let maxBlogger = ''
    for(const author in authors){
        if(authors[author]>max){
            maxBlogger=author
            max=authors[author]
        }
    }
    if (max===-1){
        return null
    }
    return {
        author: maxBlogger,
        max: max
    } 
}

const mostLikes = (blogs) =>{
    let authorLikes = blogs.reduce((object, blog) => {
        object[blog.author] = object[blog.author] || 0
        object[blog.author] += blog.likes
        return object
      },{})
    if(authorLikes==={}) return null
    let max = -1
    let maxBlogger =''
    for(const author in authorLikes){
        if(authorLikes[author]>max){
            maxBlogger=author
            max=authorLikes[author]
        }
    }
    if (max===-1){
        return null
    }
    return {
        author: maxBlogger,
        likes: max
    } 


}

module.exports={
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0) //0 is optional initial value

}

const favoriteBlog = (blogs) => {


    const fav_blog = blogs.reduce((prev, blog) => {

        if (blog.likes > prev.likes) {
            return blog
        }

        return prev
    })

    return JSON.parse(JSON.stringify(fav_blog)) ? {
        title: fav_blog.title,
        author: fav_blog.author,
        likes: fav_blog.likes
    } : {}
}


const mostBlogs = (blogs) => {
    //use hash map 
    let map = new Map();

    blogs.forEach((blog) => {

        if (map.has(blog.author)) {
            map.set(blog.author, map.get(blog.author) + 1)
        } else {
            map.set(blog.author, 1)
        }

    })
    let maxEntry = [...map.entries()].reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);

    return {
        author: maxEntry[0],
        blogs: maxEntry[1]
    };

}

const mostLikes = (blogs) => {
    let map = new Map();

    blogs.forEach((blog) => {

        if (map.has(blog.author)) {
            map.set(blog.author, map.get(blog.author) + blog.likes)
        } else {
            map.set(blog.author, blog.likes)
        }

    })
    let maxEntry = [...map.entries()].reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);

    return {
        author: maxEntry[0],
        likes: maxEntry[1]
    };


}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
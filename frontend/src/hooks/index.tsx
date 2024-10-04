import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
import { format } from "date-fns";

function formatCreatedAt(dateString: string): string {
    const date = new Date(dateString);
    return format(date, "do MMM");

  }
export interface Blog{
        "content": string,
        "title": string,
        "id": number,
        "author": {
            "name": string
        },
        "createdAt" : string,
}

export const useBlog = ({ id }: {id : string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();


    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            // headers : {
            //     Authorization : localStorage.getItem("token")
            // }
            withCredentials: true
        })
            .then(response => {
                const fetchedBlog = response.data.blog;

                const formattedblog = {
                    ...fetchedBlog,
                    createdAt : formatCreatedAt(fetchedBlog.createdAt)
                }
                // setBlog(response.data.blog);
                setBlog(formattedblog);
                setLoading(false);
            })
    }, [id])
    return {
        loading,
        blog
    }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);


    useEffect(()=>{
         axios.get(`${BACKEND_URL}/api/v1/blog/bulk`
            //  {
            // headers : {
            //     Authorization : localStorage.getItem("token")
            // }
        // }
    )
            .then(response => {
                console.log(response.data.blogs)
                const formattedBlogs = response.data.blogs.map((blog : Blog) => ({
                    ...blog,
                    createdAt: formatCreatedAt(blog.createdAt)
                }));
                // console.log(formatCreatedAt);
                setBlogs(formattedBlogs);
                // setBlogs(response.data.blogs);
                setLoading(false);
            })
    }, [])
    return {
        loading,
        blogs
    }
}
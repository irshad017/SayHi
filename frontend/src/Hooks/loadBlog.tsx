import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config"

export const UseBlogs = () => {
    const [loading, setLoading] = useState(true)
    const [blogs, setBlogs] = useState([])

    useEffect(  () => {
        const fetch = async ()=> {
            console.log("Token", localStorage.getItem("token"))
            const getBlogs = await axios.get(`${BACKEND_URL}/api/v1/blog/getblogs`,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            console.log(getBlogs.data.getBlogS)
            setLoading(true);
            setBlogs([])
        }
        fetch()
    },[])
    return (
        {
            loading,
            blogs
        }
    )
}
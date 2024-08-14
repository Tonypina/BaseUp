import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch( token, url ) {

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                const response = await axios({
                    method: 'get',
                    url: process.env.EXPO_PUBLIC_API_URL + url,
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })

                setData(response.data.data)
                setError(null)

            } catch (err) {
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [url, token])

    return { isLoading, data, error }
}
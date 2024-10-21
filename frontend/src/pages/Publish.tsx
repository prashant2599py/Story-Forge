import { Appbar } from "../components/AppBar"
import  axios  from "axios"
import { BACKEND_URL } from "../config"

import { useNavigate } from "react-router-dom"
import { useMemo, useRef, useState } from "react"
import JoditEditor from 'jodit-react';


export const Publish = () => {
    const editor = useRef(null);
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    // const handleContentChange = (newContent : string) => {
    //     setContent(newContent);
    // }

    const convertToPlainText = (html: string) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.textContent || tempElement.innerText || '';
    }
    const plainTextContent = convertToPlainText(content)

    const editorConfig = useMemo( () => ({
        height : 400,
    }), [])

    async function handleRequest(){
        try{
            const response =  await axios.post(`${BACKEND_URL}/api/v1/blog/post`, {
                title,
                content : plainTextContent
            }, {
                headers: {
                    'Content-Type'  :"application/json"
                },
                withCredentials: true
            }        
        );
            // console.log(response);
            navigate(`/blog/${response.data.id}`)

        }catch(err){
            console.error(err)
        }
    }
        return <div className="h-screen bg-black">

            <Appbar />

            <div className="flex justify-center mt-8">
                <div className=" w-2/3">
                    <div className="mb-3 ">
                        
                    {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Upload file</label>
                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" /> */}
                        <div className="max-w-lg font-[sans-serif]  mx-auto">
                            <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                            <input type="file"
                                className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                            <p className="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                        </div>
                    </div>

                    <input onChange={(e)=> {
                        setTitle(e.target.value)
                    }} 
                    id="title" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border
                    border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:placeholder-gray-400 
                    dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Title..."  />
                </div>
            </div>

            <div className="flex justify-center mt-8">
            
                <JoditEditor
                    ref = {editor}
                    value={content}
                    onChange = {content => (setContent(content))}
                    config={editorConfig}
                    />
            </div> 

            <div className="flex justify-center mt-8 bg-black">
                <div className="flex items-center justify-between px-3 py-2">
                    <button onClick={handleRequest}
                    type="submit" className="font-medium rounded-2xl text-lg w-20 h-11 text-center me-2 mb-2 text-white bg-slate-700">
                    Publish
                    </button>
                    
                </div>
                
            </div>           
    
    </div>
}



import { useEffect, useState } from "react";

export default function MessageTextBox({textData}){
    const [isCode, setIsCode] = useState(false)
    const [copyMsg, setCopyMsg] = useState(false);
    useEffect(()=>{
        if(textData.includes("@code") || textData.includes("import")){
            setIsCode(true)
        }
    })
    function handleCopy(e){
        console.log(e);
        navigator.clipboard.writeText(textData);
        setCopyMsg(true);
        setTimeout(() => {
            setCopyMsg(false);
        }, 3000);
        
    }
   
    return(<>
    {isCode ? (
        <>
        <pre className="text-sm rounded-sm bg-black p-0.5 font-mono overflow-x-auto">
            <code className=" text-teal-400">{textData}</code>
        </pre>
            <button onClick={(e)=>handleCopy(e)}>{copyMsg?"Copied ☑":"Copy📄"}</button>
        </>

    ):(
        <p>{textData}</p>
    )
    }

    </>)
}

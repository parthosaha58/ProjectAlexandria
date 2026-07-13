import { useEffect, useRef, useState } from 'react'

const Searchbar = () => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchterm] = useState("");
    const [data, setData] = useState([]);
    const menuRef = useRef();

    const handleChange = (e) => {
        setSearchterm(e.target.value);
    }
    const searchProduts = async () => {
        const res = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}&limit=10`);
        const jsonData = await res.json();
        setData(jsonData.products)
    }
    useEffect(() => {
        let timer = setTimeout(() => {
            searchProduts()
        }, 200)

        const handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handler)
        return () => {
            clearTimeout(timer)
            document.removeEventListener("mousedown", handler);
        }
    }, [searchTerm]);
    console.log(data);
    return (
        <div ref={menuRef}>
            <div className='form-group' >
                <input
                    type="text"
                    className='form-control'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={handleChange}
                    onClick={() => setOpen(!open)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
            </div>
            {open && (
                <ul className='list-group' >
                    {data.map(item => (
                        <li className='list-group-item' key={item.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="search-icon">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                            </svg>
                            <span>{item.title}</span>
                        </li>
                    ))}

                </ul>
            )}


        </div>

    )
}

export default Searchbar
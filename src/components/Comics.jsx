
// // src/components/Comics.jsx
// const Comics = () => {
//     return (
//         <div>
//             <h2>Comics</h2>
//             <p>This component is under construction. Check back later!</p>
//         </div>
//     );
// };

// export default Comics;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiKey, hash } from './ApiPasswords';
import { useNavigate } from 'react-router-dom';

const Comics = () => {
    // Instantiate the list of comics and the 'offset' which refers to where the list of comics will begin
    const [comics,setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const navigate = useNavigate();

    // Refetch whenever offset changes
    useEffect(() => {
        fetchComics();
    }, [offset]); 
    
    // Fetch the comics and set the list
    const fetchComics = async () => {
        try {
            setComics([]); // Clear existing comics to indicate loading
            const response = await axios.get(
                `https://gateway.marvel.com/v1/public/comics?ts=1&offset=${offset}&apikey=${apiKey}&hash=${hash}`
            );
            setComics(response.data.data.results);
        } catch (error) {
            console.error("Error getting the comics data: ", error);
            alert('Error fetching the comics, check console for details.')
        }
    };
    
    // The offset increments by 20, so next adds 20 and previous subtracts 20
    const nextOffset = () => {
        setOffset((prevOffset) => prevOffset + 20);
    };
    
    const previousOffset = () => {
        setOffset((prevOffset) => prevOffset - 20);
    };    

    return (
        <div id="comic-list">
            <h1 className="text-center bg-dark text-light p-3">Marvel Comics</h1>
            {/* Using cards in Bootstrap, we're adding the thumbnail and name from the API for each comic */}
            <div className="row g-4">
                {comics.length>0 ?
                    (comics.map(comic => (
                            <a className="col-md-4 mb-3" key={comic.id} href={'#comic-detail'}  onClick={() => navigate(`/comics/${comic.id}`)}>
                                        <div className="card cardHover">
                                            <center><img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} style={{height:300}} className={"card-img-top rounded"} alt={`${comic.name} Image`}/></center>
                                            <div className="card-body">
                                                <h5 className="card-title text-center">{comic.title}</h5>
                                            </div>
                                        </div>
                            </a>
                    ))) : 
                    <p> Loading comics....</p>
                }
                {/* Once loaded, the Next/Previous navigation buttons will also appear */}
                </div>
                {comics.length >0 ?
                    <div className="d-flex bg-dark justify-content-center mt-4 pt-3">
                        <ul className="pagination">
                            {offset==0 ? 
                                (<li className={'page-item disabled bg-dark'}><a href="#comic-list" className={'page-link'}>Previous</a></li>) : 
                                (<li className={'page-item bg-dark'}><a className={'page-link'} onClick={() => previousOffset()}>Previous</a></li>)
                            }
                            {offset>=1544 ? 
                                (<li className={'page-item disabled bg-dark'}><a className={'page-link'}>Next</a></li>) : 
                                (<li className={'page-item bg-dark'}><a href="#comic-list" className={'page-link'} onClick={() => nextOffset()}>Next</a></li>)
                            }
                        </ul>
                    </div>
                : null}
        </div>
    );
}

export default Comics;
import { useEffect, useState } from "react";
import axios from 'axios';
import { apiKey, hash } from './ApiPasswords';
import { useParams, useNavigate } from 'react-router-dom';

const CharacterDetail = () => {
    // Instantiate the character details and the list of comics
    const [characterDeets, setCharacterDeets] = useState([]);
    const [comicsData, setComicsData] = useState([]);
    const [offset, setOffset] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();


    // Initiated when selected character changes
    useEffect(() => {
        const fetchCharacterDeets = async () => {
            try {
                // Clear comics data when fetching new character details
                setComicsData([]); 
                // Fetch character details and set them
                const response = await axios.get(
                    `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=1&apikey=${apiKey}&hash=${hash}`
                );
                const character = response.data.data.results[0];
                setCharacterDeets(character);
    
                // Fetch comics if collectionURI exists and set them
                const apiURL = character?.comics?.collectionURI || null;
                if (apiURL) {
                    const comicResponse = await axios.get(
                        `${apiURL}?ts=1&offset=${offset}&apikey=${apiKey}&hash=${hash}`
                    );
                    setComicsData(comicResponse.data.data.results);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                alert('Error fetching character details, see console for details.')
            }
        };
    
        if (id) {
            fetchCharacterDeets();
        }
    }, [id, offset]); 

    // The offset increments by 20, so next adds 20 and previous subtracts 20
    const nextOffset = () => {
        setOffset((prevOffset) => prevOffset + 20);
    };
    
    const previousOffset = () => {
        setOffset((prevOffset) => prevOffset - 20);
    }; 

    return (
        <div className="text-center" id='character-detail'>
            <h1 className="text-center bg-dark text-light p-3 mt-3">Character Detail</h1>
            {/* The Character Details section displays the name, thumbnail, and description (if available). */}
            <div className="container-fluid bg-light mt-3 p-5">
                {characterDeets && characterDeets.thumbnail ? (
                    <>
                        <h1>{characterDeets.name}</h1>

                        <img    src={`${characterDeets.thumbnail.path}.${characterDeets.thumbnail.extension}`} 
                                className="card-img-top rounded" 
                                alt={`${characterDeets.name} Image`}/>
                        <div>
                            {characterDeets.description && characterDeets.description !== "" ? (
                                <p className="mt-3">{characterDeets.description}</p>
                            ) : (
                                <p>No description available.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <h2>Loading character details...</h2>
                )}
                {/* And it displays the comics (if available) with their thumbnail, title, and description (if available) up to 20 comics. */}
                <div className="row g-4" id="comic-list">
                {comicsData.length > 0 ? ( 
                    <>
                    <h2 className="text-center">Comics<br/><span className="lead">({characterDeets.comics.available} Total Comics Available)</span></h2>
                    {comicsData.map(comic => (
                            <div className="col-md-4 mb-3" key={comic.id} href={'#comic-detail'}  onClick={() => navigate(`/comics/${comic.id}`)}>
                                        <div className="card cardHover">
                                            <center><img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} style={{height:300}} className={"card-img-top rounded"} alt={`${comic.title} Image`}/></center>
                                            <div className="card-body">
                                                <h5 className="card-title text-center">{comic.title}</h5>
                                                {comic.description && comic.description !== "" ? 
                                                (<p className="card-text">{comic.description}</p>) : 
                                                (<p className="card-text">No description available.</p>) }
                                            </div>
                                        </div>
                            </div>
                        ))}
                    </> 
                ) : (
                    <h2>Loading comic list...</h2>
                )}
                </div>
                <button className="btn btn-primary mt-5" onClick={() => navigate('/characters/')}>Back to Browse</button>
            </div>
            {comicsData.length >0 ?
                    <div className="d-flex bg-dark justify-content-center mt-4 pt-3">
                        <ul className="pagination">
                            {offset==0 ? 
                                (<li className={'page-item disabled bg-dark'}><a href="#comic-list" className={'page-link'}>Previous</a></li>) : 
                                (<li className={'page-item bg-dark'}><a className={'page-link'} onClick={() => previousOffset()}>Previous</a></li>)
                            }
                            {offset>=(characterDeets.comics.available-20) ? 
                                (<li className={'page-item disabled bg-dark'}><a className={'page-link'}>Next</a></li>) : 
                                (<li className={'page-item bg-dark'}><a href="#comic-list" className={'page-link'} onClick={() => nextOffset()}>Next</a></li>)
                            }
                        </ul>
                    </div>
            : null}
        </div>
    );
}

export default CharacterDetail;
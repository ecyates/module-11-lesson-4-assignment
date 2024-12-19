import { useEffect, useState } from "react";
import axios from 'axios';
import { apiKey, hash } from './ApiPasswords';
import { useParams, useNavigate } from 'react-router-dom';

const ComicDetail = () => {
    // Instantiate the comic details
    const [comicDeets, setComicDeets] = useState([]);
    const [characterData, setCharacterData] = useState([]);
    const [offset, setOffset] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();


    // Initiated when selected comic changes
    useEffect(() => {
        const fetchComicDetails = async () => {
            try {
                setCharacterData([]);

                // Fetch comic details and set them
                const response = await axios.get(
                    `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=1&apikey=${apiKey}&hash=${hash}`
                );
                const comic = response.data.data.results[0];
                setComicDeets(comic);

                // Fetch comics if collectionURI exists and set them
                const apiURL = comic?.characters?.collectionURI || null;
                if (apiURL) {
                    const characterResponse = await axios.get(
                        `${apiURL}?ts=1&offset=${offset}&apikey=${apiKey}&hash=${hash}`
                    );
                    setCharacterData(characterResponse.data.data.results);
                }
            } catch (error) {
                console.error("Error fetching comic details data: ", error);
                alert('Error fetching comic details, see console for details.')
            }
        };
    
        if (id) {
            fetchComicDetails();
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
        <div className="text-center" id='comic-detail'>
            <h1 className="text-center bg-dark text-light p-3 mt-3">Comic Details</h1>
            {/* The Comic Details section displays the name, thumbnail, and description (if available). */}
            <div className="container-fluid bg-light mt-3 p-5">
                {comicDeets && comicDeets.thumbnail ? (
                    <>
                        <h1>{comicDeets.title}</h1>

                        <img    src={`${comicDeets.thumbnail.path}.${comicDeets.thumbnail.extension}`} 
                                className="card-img-top rounded" 
                                alt={`${comicDeets.name} Image`}/>
                        <div>
                            {comicDeets.description && comicDeets.description !== "" ? (
                                <p className="mt-3">{comicDeets.description}</p>
                            ) : (
                                <p>No description available.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Loading comic details...</p>
                )}
                {/* And it displays the characters (if available) with their thumbnail, name, and description (if available) up to 20 characters. */}
                <div className="row g-4" id="character-list">
                {characterData.length > 0 ? (
                    <>
                    <h2 className="text-center">Characters</h2>
                    {characterData.map(character => (
                            <div className="col-md-4 mb-3" key={character.id} href={'#character-detail'}  onClick={() => navigate(`/characters/${character.id}`)}>
                                        <div className="card cardHover">
                                            <center><img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} style={{height:300}} className={"card-img-top rounded"} alt={`${character.name} Image`}/></center>
                                            <div className="card-body">
                                                <h5 className="card-title text-center">{character.name}</h5>
                                                {character.description && character.description !== "" ? 
                                                (<p className="card-text">{character.description}</p>) : 
                                                (<p className="card-text">No description available.</p>) }
                                            </div>
                                        </div>
                            </div>
                        ))}
                    </> 
                ) : (
                    <h2>Loading character list...</h2>
                )}
                </div>
                <button className="btn btn-primary mt-5" onClick={() => navigate('/comics/')}>Back to Browse</button>
                {characterData.length > 0 ?
                    <div className="d-flex bg-dark justify-content-center mt-4 pt-3">
                        <ul className="pagination">
                            {offset==0 ? 
                                (<li className={'page-item disabled bg-dark'}><a href="#character-list" className={'page-link'}>Previous</a></li>) : 
                                (<li className={'page-item bg-dark'}><a className={'page-link'} onClick={() => previousOffset()}>Previous</a></li>)
                            }
                            {offset>=(comicDeets.characters.available-20) ? 
                                (<li className={'page-item disabled bg-dark'}><a className={'page-link'}>Next</a></li>) : 
                                (<li className={'page-item bg-dark'}><a href="#character-list" className={'page-link'} onClick={() => nextOffset()}>Next</a></li>)
                            }
                        </ul>
                    </div>
                : null}     
            </div>
        </div>
    );
}

export default ComicDetail;
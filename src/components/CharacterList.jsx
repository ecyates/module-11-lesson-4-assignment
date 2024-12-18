import { func, number } from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiKey, hash } from './ApiPasswords';

const CharacterList = ({  onCharacterSelect }) => {
    // Instantiate the list of characters and the 'offset' which refers to where the list of characters will begin
    const [characters,setCharacters] = useState([]);
    const [offset, setOffset] = useState(0);

    // Refetch whenever offset changes
    useEffect(() => {
        fetchCharacters();
    }, [offset]); 
    
    // Fetch the characters and set the list
    const fetchCharacters = async () => {
        try {
            setCharacters([]); // Clear existing characters to indicate loading
            const response = await axios.get(
                `https://gateway.marvel.com/v1/public/characters?ts=1&offset=${offset}&apikey=${apiKey}&hash=${hash}`
            );
            setCharacters(response.data.data.results);
        } catch (error) {
            console.error("Error getting the character data: ", error);
            alert('Error fetching the characters, check console for details.')
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
        <div id="character-list">
            <h1 className="text-center bg-dark text-light p-3">Marvel Characters</h1>
            {/* Using cards in Bootstrap, we're adding the thumbnail and name from the API for each character */}
            <div className="row g-4">
                {characters.length>0 ?
                    (characters.map(character => (
                            <a className="col-md-4 mb-3" key={character.id} href={'#character-detail'}  onClick={() => onCharacterSelect(character.id)}>
                                        <div className="card cardHover">
                                            <center><img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} style={{height:300}} className={"card-img-top rounded"} alt={`${character.name} Image`}/></center>
                                            <div className="card-body">
                                                <h5 className="card-title text-center">{character.name}</h5>
                                            </div>
                                        </div>
                            </a>
                    ))) : 
                    <p> Loading characters....</p>
                }
                {/* Once loaded, the Next/Previous navigation buttons will also appear */}
                </div>
                {characters.length >0 ?
                    <div className="d-flex bg-dark justify-content-center mt-4 pt-3">
                        <ul className="pagination">
                            {offset==0 ? 
                                (<li className={'page-item disabled bg-dark'}><a href="#character-list" className={'page-link'}>Previous</a></li>) : 
                                (<li className={'page-item bg-dark'}><a className={'page-link'} onClick={() => previousOffset()}>Previous</a></li>)
                            }
                            {offset>=1544 ? 
                                (<li className={'page-item disabled bg-dark'}><a className={'page-link'}>Next</a></li>) : 
                                (<li className={'page-item bg-dark'}><a href="#character-list" className={'page-link'} onClick={() => nextOffset()}>Next</a></li>)
                            }
                        </ul>
                    </div>
                : null}
        </div>
    );
}

CharacterList.propTypes = {
    selectedCharacter: number, // The character id
    onCharacterSelect: func // Function to update the character id when clicked
}

export default CharacterList;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Used to fetch the list of characters
function Characters() {

    const [characters, setCharacters] = useState([])
    const [favouriteCharacters, setFavouriteCharacters] = useState([])
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    //Calling the backend to add the character to the favourites page of the user and also change the button to 'add to favourites'
    const handleAddToFavourites = async(id) => {
        await axios.post(`http://${process.env.REACT_APP_API_URL}/update_favourites/`, {userData: user, 'character_id': id})  
        const charToAdd = characters.find(c => c.id === id);
        if (charToAdd) {
            setFavouriteCharacters(prevFavourites => [...prevFavourites, charToAdd]);
        }
    };

    //Calling the backend to remove the character to the favourites page of the user and also change the button to 'add to favourites'
    const handleRemovefromFavourites = async(id) => {
        if (!user) return;
        await axios.post(`http://${process.env.REACT_APP_API_URL}/remove_favourites/`, {userData: user, 'character_id': id})  
        setFavouriteCharacters(prevFavourites =>
            prevFavourites.filter(char => char.id !== id)
        );
    };

    // Fetching all the favourite characters of Rick and Morty
    useEffect(() => {
        if (!user) return;
        axios.get(`http://${process.env.REACT_APP_API_URL}/fetch_favourites/`, {headers: {userData: user.username}})
        .then(response => {
            const favCharacterIDList = response.data.favourites
            axios.get('https://rickandmortyapi.com/api/character')
            .then(response => {
                setFavouriteCharacters(response.data.results.filter(item => favCharacterIDList.includes(item.id)));
            })
        })
        .catch(error => {
            console.error('Error fetching characters:', error);
        });
    }, []);

    // Fetching all the characters of Rick and Morty
    useEffect(() => {

        axios.get('https://rickandmortyapi.com/api/character')
            .then(response => {
                setCharacters(response.data.results);
            })
            .catch(error => {
                console.error('Error fetching characters:', error);
            });
        }, []);
    
    
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Rick & Morty Characters</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>

                {/*Displays the list of Rick and Morty characters*/}
                {characters.map(char => (
                    <div 
                        key={char.id} 
                        style={{ 
                            border: '1px solid #ccc', 
                            borderRadius: '8px', 
                            padding: '10px', 
                            width: '200px', 
                            textAlign: 'center',
                            position: 'relative' 
                        }}
                    >
                        <Link 
                            to={`/characters/${char.id}`} 
                            style={{ 
                                textDecoration: 'none', 
                                color: 'inherit', 
                                display: 'block' 
                            }}
                        >
                            <img src={char.image} alt={char.name} style={{ width: '100%', borderRadius: '8px' }} />
                            <h3>{char.name}</h3>
                            <p>Status: {char.status}</p>
                            <p>Species: {char.species}</p>
                        </Link>

                        { /* Change the button design based on if the Ricky and Morty character is a favourite*/}
                        {user && !favouriteCharacters.some(fav => fav.id === char.id) && (
                            <button 
                                onClick={() => handleAddToFavourites(char.id)} 
                                style={{ 
                                    marginTop: '10px', 
                                    padding: '5px 10px', 
                                    borderRadius: '4px', 
                                    border: 'none', 
                                    backgroundColor: '#007bff', 
                                    color: 'white', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Add to Favourites
                            </button>)
                        }

                        { /* This is if it's already a favourite in which case it will ask you to remove from favourites */}
                        {user && favouriteCharacters.some(fav => fav.id === char.id) && (
                            <button 
                                onClick={() => handleRemovefromFavourites(char.id)} 
                                style={{ 
                                    marginTop: '10px', 
                                    padding: '5px 10px', 
                                    borderRadius: '4px', 
                                    border: 'none', 
                                    backgroundColor: '#ff7b7b', 
                                    color: 'white', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Remove from favourites
                            </button>)
                        }
                    </div>
                ))}
            </div>  
        </div>
    );
}

export default Characters;

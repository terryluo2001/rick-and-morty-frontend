import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';   

// Used to fetch the list of characters
function SavedCharacters() {

    const user = JSON.parse(sessionStorage.getItem("user"));
    const [favouriteCharacters, setFavouriteCharacters] = useState([])
    
    // Calling the favourites and filtering the rick and morty api to get a list of the details of favourites
    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_API_URL}/fetch_favourites/`, {headers: {: user.username}})
            .then(response => {
                const favCharacterIDList = response.data.favourites
                console.log(favCharacterIDList);
                axios.get('https://rickandmortyapi.com/api/character')
                .then(response => {
                    setFavouriteCharacters(response.data.results.filter(item => favCharacterIDList.includes(item.id)));
                })
            })
            .catch(error => {
                console.error('Error fetching characters:', error);
            });
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Saved Characters</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>

                {/*Displaying the list of favourites*/}
                {favouriteCharacters.map(char => (
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
                    </div>
                ))}
            </div>  
        </div>
    );
}

export default SavedCharacters;

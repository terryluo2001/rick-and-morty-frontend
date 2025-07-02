import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Used to fetch each individual character profile
function Characters() {
    const { characterId } = useParams();
    const id = Number(characterId);
    const [characters, setCharacters] = useState([])
    const [episodes, setEpisodes] = useState([])

    //Fetching the characters
    useEffect(() => {
        axios.get(`https://rickandmortyapi.com/api/character/`)
            .then(response => {         
                setCharacters(response.data.results);
                response.data.results.forEach(character => {

                    //If the id is the correct character
                    if (character.id === id) {
                        
                        //Fetch the episode list of the selected id
                        character.episode.forEach(episode => {
                            axios.get(episode)
                            .then(response => {
                                const newEpisode = {
                                    id: response.data.id,
                                    name: response.data.name,
                                    air_date: response.data.air_date,
                                    episode: response.data.episode,
                                };

                                setEpisodes((prevEpisodes) => [...prevEpisodes, newEpisode]);   
                            })
                        })
                    }               
                })
                console.log(episodes);
            })
            .catch(error => {
                console.error('Error fetching characters:', error);
            });
        }, []);

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px'}}>
                {characters.filter(char => char.id === id)
                .map(char => (
                    
                    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
                    <h1 style={{ textAlign: 'center' }}>{char.name}</h1>
                    <img src={char.image} alt={`${char.name} portrait`} style={{ width: '100%', borderRadius: '8px' }} />
                    <p><strong>Species:</strong> {char.species}</p>
                    <p><strong>Gender:</strong> {char.gender}</p>
                    <p><strong>Episodes:</strong></p>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {episodes.map(episode => (
                        <li key={episode.id} style={{ marginBottom: '10px' }}>
                            <div><strong>Title:</strong> {episode.name}</div>
                            <div><strong>Air Date:</strong> {episode.air_date}</div>
                            <div><strong>Episode No:</strong> {episode.episode}</div>
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Characters;

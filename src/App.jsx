import './AppStyles.css';
import { useState } from 'react';
import CharacterList from './components/CharacterList';
import CharacterDetail from './components/CharacterDetail';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import Comics from './components/Comics';

const App =()=> {
  // Keep track of the character that's clicked on. 
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Handling when a character gets clicked on we need to receive the information from 'Character List' 
  // and relay the information to 'Character Detail'
  const handleCharacterSelect = (characterId) => {
    setSelectedCharacter(characterId);
  }

  return (
    <>    
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/characters/' element={<CharacterList/>}/>
        <Route path='/characters/:id' element={<CharacterDetail/>}/>
        <Route path='/comics/' element={<Comics/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App;

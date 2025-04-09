/**
 * Search - Provides a search bar to filter properties by address, city, etc
 * Updates parent component's query state in real-time.
 */
import { useState } from 'react';

const Search = ({ setSearchQuery }) => {
  const [input, setInput] = useState('');

  //handleInput - Updates the input state and calls setSearchQuery to filter properties
  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearchQuery(value);
  };

  return (
    <header>
      <h2 className="header__title">Search it. Explore it. Buy it.</h2>
      <input
        type="text"
        className="header__search"
        placeholder="Enter an address, neighborhood, city, or ZIP code"
        value={input}
        onChange={handleInput}
      />
    </header>
  );
};

export default Search;

/**
 * Search.js
 *
 * Provides a search bar to filter properties by address, city, etc.
 * Calls the parent's setSearchQuery function with updated input.
 */
import { useState } from 'react';

const Search = ({ setSearchQuery }) => {
  // State to manage the input value of the search bar
  const [input, setInput] = useState('');

  //handleInput - Updates the input state and calls setSearchQuery to filter properties
  const handleInput = (e) => {
    const value = e.target.value; //current input value
    setInput(value); //update internal input state
    setSearchQuery(value); //call parent's function to filter properties
  };

  // JSX layout for the search UI
  return (
    <header>
      {/* Section heading */}
      <h2 className="header__title">Search it. Explore it. Buy it.</h2>

      {/* Search bar */}
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

import { useState } from 'react';

const Search = ({ setSearchQuery }) => {
  const [input, setInput] = useState('');

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearchQuery(value); // Updates parent state
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

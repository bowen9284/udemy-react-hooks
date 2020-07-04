import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const firebaseUrl =
  'https://react-hooks-update-4556c.firebaseio.com/ingredients.json';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');

  useEffect(() => {
    const query =
      enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
    const fetchData = async () => {
      const response = await fetch(firebaseUrl + query);
      const responseJson = await response.json();
      const loadedIngredients = [];
      for (const key in responseJson) {
        loadedIngredients.push({
          id: key,
          title: responseJson[key].title,
          amount: responseJson[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    };
    fetchData();
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;

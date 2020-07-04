import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const firebaseUrl =
  'https://react-hooks-update-4556c.firebaseio.com/ingredients.json';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  
  useEffect(() => {
    console.log('RENDER INGSSS');
  }, [userIngredients]);

  const addIngredientHandler = async (ingredient) => {
    let response = await fetch(firebaseUrl, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    });
    const responseJson = await response.json();
    setUserIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: responseJson.name, ...ingredient },
    ]);
  };

  const removeIngredientHandler = (id) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI//ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('Should not get here');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    loading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
  } = useHttp();

  useEffect(() => {
    if (!loading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!loading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, loading, error]);

  const addIngredientHandler = useCallback(async (ingredient) => {
    sendRequest(
      `https://react-hooks-update-4556c.firebaseio.com/ingredients.json`,
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
    // dispatchHttp({ type: 'SEND' });
    // try {
    //   let response = await fetch(`${firebaseUrl}/ingredients.json`, {
    //     method: 'POST',
    //     body: JSON.stringify(ingredient),
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //   const responseJson = await response.json();
    //   dispatch({
    //     type: 'ADD',
    //     ingredient: { id: responseJson.name, ...ingredient },
    //   });
    // } catch (error) {
    //   dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
    // }
    // dispatchHttp({ type: 'RESPONSE' });
  }, []);

  const removeIngredientHandler = useCallback(
    async (id) => {
      sendRequest(
        `https://react-hooks-update-4556c.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;

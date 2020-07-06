import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI//ErrorModal';
import Search from './Search';

const firebaseUrl = 'https://react-hooks-update-4556c.firebaseio.com';

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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not get here');
  }
};
const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  useEffect(() => {
    console.log('RENDER');
  }, [userIngredients]);

  const addIngredientHandler = useCallback(async (ingredient) => {
    dispatchHttp({ type: 'SEND' });

    try {
      let response = await fetch(`${firebaseUrl}/ingredients.json`, {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      });

      const responseJson = await response.json();
      dispatch({
        type: 'ADD',
        ingredient: { id: responseJson.name, ...ingredient },
      });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
    }

    dispatchHttp({ type: 'RESPONSE' });
  }, []);

  const removeIngredientHandler = useCallback(async (id) => {
    dispatchHttp({ type: 'SEND' });

    try {
      await fetch(`${firebaseUrl}/ingredients/${id}.json`, {
        method: 'DELETE',
      });
      dispatch({ type: 'DELETE', id });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
    }

    dispatchHttp({ type: 'RESPONSE' });
  }, []);

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
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
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />
      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;

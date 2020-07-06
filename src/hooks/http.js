import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};
const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not get here');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    async (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifier });

      try {
        const response = await fetch(url, {
          method,
          body,
          headers: {
            'Content-type': 'application/json',
          },
        });
        dispatchHttp({
          type: 'RESPONSE',
          responseData: response.json(),
          extra: reqExtra,
        });
      } catch (error) {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      }
    },
    []
  );

  return {
    loading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear,
  };
};

export default useHttp;

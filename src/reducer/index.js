import React from "react";

// we need this only for redux

// now we want to implement Provider and connect also combineReducers

// suppose we have reducer likje this
// import R1 from './r1
// import R2 from './r2

// combineReducers({
//   RRRRR1: R1,
//   Rgdhyd2L: R2
// })
const combineReducers = reducers => {
  const nextState = {};
  const reducerFunctions = {};
  const reducerKeys = Object.keys(reducers);
  //[RRRR1,Rgdhyd2L];
  return (state = {}, action) => {
    reducerKeys.forEach(reducerKey => {
      if (typeof reducers[reducerKey] === "function") {
        const reducer = reducers[reducerKey];
        nextState[reducerKey] = reducer(state[reducerKey], action);
      }
    });
  };
  return nextState;
};

const createStore = rootReducer => {
  let state;
  let listeners = [];

  const getState = () => state;
  const dispatch = action => {
    state = rootReducer(state, action);
    listeners.forEach(listener => listener(state));
  };
  const subscribe = listener => {
    listeners.push(listener);
  };
  dispatch({});

  return { getState, dispatch, subscribe };
};

const ReduxContext = React.createContext("redux");

const Provider = ({ store, children }) => {
  return (
    <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>
  );
};

const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  class Connect extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.store.getState();
    }
    componentDidMount() {
      this.props.store.subscribe(state => {
        this.setState(state);
      });
    }

    render() {
      const { store } = this.props;
      return (
        <Component
          {...this.props}
          {...mapStateToProps(store.getState())}
          {...mapDispatchToProps(store.dispatch)}
        />
      );
    }
  }
};
export { createStore, combineReducers, connect, Provider };

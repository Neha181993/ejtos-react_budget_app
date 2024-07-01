import React, { createContext, useReducer, useTransition } from 'react';

// 5. The reducer - this is used to update the state, based on the action
export const AppReducer = (state, action) => {
    let budget = 0;
    switch (action.type) {
        case 'ADD_EXPENSE':
            let total_budget = 0;
            total_budget = state.expenses.reduce(
                (previousExp, currentExp) => {
                    return previousExp + currentExp.cost
                },0
            );
            total_budget = total_budget + action.payload.cost;
            action.type = "DONE";
            if(total_budget <= state.budget) {
                total_budget = 0;
                state.expenses.map((currentExp)=> {
                    if(currentExp.name === action.payload.name) {
                        currentExp.cost = action.payload.cost + currentExp.cost;
                    }
                    return currentExp
                });
                return {
                    ...state,
                };
            } else {
                alert("The value should not exceed remaining funds" );
                return {
                    ...state
                }
            }
            case 'RED_EXPENSE':
                const red_expenses = state.expenses.map((currentExp)=> {
                    if (currentExp.name === action.payload.name && currentExp.cost - action.payload.cost >= 0) {
                        currentExp.cost =  currentExp.cost - action.payload.cost;
                        budget = state.budget + action.payload.cost
                    }
                    return currentExp
                })
                action.type = "DONE";
                return {
                    ...state,
                    expenses: [...red_expenses],
                };
            case 'DELETE_EXPENSE':
            action.type = "DONE";
            state.expenses.map((currentExp)=> {
                if (currentExp.name === action.payload) {
                    budget = state.budget + currentExp.cost
                    currentExp.cost =  0;
                }
                return currentExp
            })
            action.type = "DONE";
            return {
                ...state,
                budget
            };
        case 'SET_BUDGET':
            action.type = "DONE";
            state.budget = action.payload;

            return {
                ...state,
            };
        case 'CHG_CURRENCY':
            action.type = "DONE";
            state.currency = action.payload;
            return {
                ...state
            }

        default:
            return state;
    }
};
// Added a comment line 
// 1. Sets the initial state when the app loads
const initialState = {
    budget: 2000,
    expenses: [
        { id: "Marketing", name: 'Marketing', cost: 50 },
        { id: "Finance", name: 'Finance', cost: 300 },
        { id: "Sales", name: 'Sales', cost: 70 },
        { id: "Human Resource", name: 'Human Resource', cost: 40 },
        { id: "IT", name: 'IT', cost: 500 },
    ],
    currency: '£'
};

// 2. Creates the context this is the thing our components import and use to get the state
export const AppContext = createContext();

// 3. Provider component - wraps the components we want to give access to the state
// Accepts the children, which are the nested(wrapped) components
export const AppProvider = (props) => {
    // 4. Sets up the app state. takes a reducer, and an initial state
    const [state, dispatch] = useReducer(AppReducer, initialState);
    let remaining = 0;

    if (state.expenses) {
            const totalExpenses = state.expenses.reduce((total, item) => {
            return (total = total + item.cost);
        }, 0);
        remaining = state.budget - totalExpenses;
    }

   return (
        <AppContext.Provider
            value={{
                expenses: state.expenses,
                budget: state.budget,
                remaining: remaining,
                dispatch,
                currency: state.currency
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};



// Flow of execution of React Application:- 

    // 1. The AppProvider component is rendered
    // 2. The AppProvider component renders the AppContext.Provider component
    // 3. The AppContext.Provider component renders the App component
    // 4. The App component renders the ExpenseList component
    // 5. The ExpenseList component renders the ExpenseItem component



// React Hooks used in this application:

    //usereducer:- 

        /*  
        1. useReducer is a custom hook that allows us to manage the state of our application
        2. It's particularly useful when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.
        3. Mainrains the state logic and seperate from it's compenents.
        4. Userreducer is extension to usestate Hooks , it's a good alternative to useState when you have complex state logic that involves multiple sublogics. 


        -- Example:- 

        -- Declaring usereducer function in component:- 

        import React, { useReducer } from 'react';

            function Counter() {
            const [state, dispatch] = useReducer(counterReducer, { count: 0 });

            return (
                <div>
                <p>Count: {state.count}</p>
                <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
                <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
                </div>
            );
            }

            export default Counter;

            Note:- userreducer takes two argument one is a function which is being declared ahead and 
            second is the initial state of the component.

            -- Initialstate in above example is initial state of various components defined within application. 
            -- Declaring usereducer function ahead of component:-
            -- Word dispatch sends the execution to reducer function. Based on the type defined action would be taken. 

        -- Defining the reducer function:-

        import React, { useReducer } from 'react';

        function Counter() {
        const [state, dispatch] = useReducer(counterReducer, { count: 0 });

            return (
                <div>
                <p>Count: {state.count}</p>
                <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
                <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
                </div>
            );
            }

            export default Counter;

        -- Defined reducer function
        -- It has two elements state and dispatch. state would be defined by us for various actions we need 
        to manage within application 


        function counterReducer(state, action) {
             switch (action.type) {
                case 'increment':
                return { count: state.count + 1 };
                case 'decrement':
                return { count: state.count - 1 };
                default:
                throw new Error(`Unknown action: ${action.type}`);
  }
}

 In the above code userreducer function is maintained within AppContext.js where various 
 applications states are maintained. 
        
       
 
 */

    //useState:- 

    // useState is a hook which is used to maintain the state of the component.

/*              Example:- 
                import React, { useState } from 'react';

            function Counter() {
            const [count, setCount] = useState(0);

            return (
                <div>
                <p>Count: {count}</p>
                <button onClick={() => setCount(count + 1)}>Increment</button>
                </div>
            );
            }

            export default Counter;
*/




//useContext


        /*

        The useContext hook is used to consume values from a React context.
        Context provides a way to pass data through the component tree without having to pass props manually at every level
    

       --  Creating a Context:   
        To create a context, we need to use the createContext() method. This method returns an object

        import React, { createContext, useState, useContext } from 'react';

        // Create a context with a default value
        const ThemeContext = createContext('light');

        -- Providing Context:

                    function App() {
            const [theme, setTheme] = useState('light');

            return (
                <ThemeContext.Provider value={{ theme, setTheme }}>
                <Toolbar />
                </ThemeContext.Provider>
            );
            }



       --  Consuming Context:

                        function Toolbar() {
                return (
                    <div>
                    <ThemeButton />
                    </div>
                );
                }

                function ThemeButton() {
                const { theme, setTheme } = useContext(ThemeContext);

                return (
                    <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}
                    >
                    Toggle Theme
                    </button>
                );
                }





        */

        


 //useEffect


/*

        The useEffect Hook allows us to perform side effects on the components. 
        fetching data, directly updating the DOM and timers are some side effects. 
        It is called every time any state if the dependency array is modified or updated.

         It is called after the render method is called.

         Examples:- 

         No depenencies

                useEffect(() => {
        // Runs on every render
        });

        Empty Dependencies

                useEffect(() => {
        // Runs only once after the initial render
        }, []);


        Specific Dependencies:-

                useEffect(() => {
        // Runs when 'count' changes
        }, [count]);


*/ 


/*

UseParam:-


useParams is one of the hooks of React-Router that returns a dynamic parameter of the URL that the user is currently on
useParams() will return the params object, which will refer to any dynamic part of the URL. You can assign the returned value of the useParams function to a variable.
                // App.js
                import React from 'react';
                import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
                import Home from './Home';
                import UserProfile from './UserProfile';

                function App() {
                return (
                    <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/user/:userId" component={UserProfile} />
                    </Switch>
                    </Router>
                );
                }

                export default App;

                // UserProfile.js
                import React from 'react';
                import { useParams } from 'react-router-dom';

                function UserProfile() {
                const { userId } = useParams(); // Extracting the userId parameter from the URL

                return (
                    <div>
                    <h1>User Profile</h1>
                    <p>User ID: {userId}</p>
                    </div>
                );
                }

                export default UserProfile;




Usetranslation:- 


- The useTranslation hook from react-i18next is used for internationalization in React apps.
- You need to initialize i18next with your translation resources and configure it.
- The useTranslation hook provides access to the translation function t and the i18n instance.
- Translations can be dynamically changed, and variables can be passed to translation strings for dynamic content.



import React from 'react';
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>French</button>
    </div>
  );
}

export default MyComponent;



*/


/*

useDispatch:- 

- `useReducer` is used within React components to manage local component state using a reducer function.
- `useDispatch` is used with React-Redux to dispatch actions to the global Redux store, 
   allowing components to interact with and update global application state managed by Redux.

   The **useDispatch** hook is a utility provided by the Redux library that 
   allows React components to dispatch actions to the Redux store.

Example of store :- 

    Setting up a Redux:-

   1. npm install redux react-redux

   2. Define actions that are part of different events of your application
            // actions.js
        export const increment = () => ({
        type: 'INCREMENT'
        });

        export const decrement = () => ({
        type: 'DECREMENT'
        });

    3. Defining reducer same as usereducer

                // reducers.js
        const initialState = {
        count: 0
        };

        export const counterReducer = (state = initialState, action) => {
        switch (action.type) {
            case 'INCREMENT':
            return { ...state, count: state.count + 1 };
            case 'DECREMENT':
            return { ...state, count: state.count - 1 };
            default:
            return state;
        }
        };
    
    4. Create a Redux store by combining reducer  and applying middleware:-


                    // store.js
            import { createStore } from 'redux';
            import { counterReducer } from './reducers';

            const store = createStore(counterReducer);

            export default store;

    5. Wrap the application in provider and pass the store to it:-

                // index.js
            import React from 'react';
            import ReactDOM from 'react-dom';
            import { Provider } from 'react-redux';
            import App from './App';
            import store from './store';

            ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')
            );

    6. Connect your components to redux store:-

                // Counter.js
            import React from 'react';
            import { useSelector, useDispatch } from 'react-redux';
            import { increment, decrement } from './actions';

            function Counter() {
            const count = useSelector(  state => state.count);
            const dispatch = useDispatch();

            return (
                <div>
                <h1>Counter: {count}</h1>
                <button onClick={() => dispatch(increment())}>Increment</button>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
                </div>
            );
            }

            export default Counter;



*/

/*

useSelector:-

- The useSelector hook is a feature provided by the React-Redux library that allows React components to 
access the state stored in a Redux store. 
- useselector example is as given above, it can be used along with useDispatch. 

*/


/*

useRef:- 


        import React, { useRef } from 'react';

        function FocusInput() {
        const inputRef = useRef(null);

        const focusInput = () => {
            if (inputRef.current) {
            inputRef.current.focus();
            }
        };

        return (
            <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus Input</button>
            </div>
        );
        }

        export default FocusInput;

Persisting Values Across Renders:

        import React, { useRef, useState } from 'react';

        function Timer() {
        const [count, setCount] = useState(0);
        const intervalRef = useRef();

        React.useEffect(() => {
            intervalRef.current = setInterval(() => {
            setCount((prevCount) => prevCount + 1);
            }, 1000);

            return () => clearInterval(intervalRef.current);
        }, []);

        return <h1>{count}</h1>;
        }

        export default Timer;


*/

// Flow of react application 

    /* 
       1. Execution starts with App.js which is importing AppContext.js in it
	2. AppContext.js :- In this initialstates of the components attributes are defined which is being passed to the
          child components, also createcontext being created and passed through Appprovider to 
          it's child components. Along with CreateContext, Initialstates - various reducer actions are defined 
          and passed to it's child components. 
       3. Inidivial components here are different parts of from end applications such as 
       
          Budget.js(budget on app) , ExpenseTotal.js(Sepends so for on app) and Remaining.js(Remaining part on the application) are defined at the top as the top elemnts. 
          ExpenseItems.js , ExpenseList.js and  are defined the middle part. 
	4. If state changes of one component needs to be added to other components, that component can be called using usecontext of those components along with dispatch method, here 
 	   dispatch method will send a text which needed for rducer. Dispatch method is defined in main app context along with reducer function. 

*/

/*


            `map and reduce Functions in JavaScript

            const newArray = array.map((element, index, array) => {
            // Return the new value for the new array
            });


            const numbers = [1, 2, 3, 4, 5];

            // Double each number in the array
            const doubled = numbers.map(number => number * 2);

            console.log(doubled); // Output: [2, 4, 6, 8, 10]


Reduce:- 



    const result = array.reduce((accumulator, currentValue, index, array) => {
    // Modify and return the accumulator
    }, initialValue);



    const numbers = [1, 2, 3, 4, 5];

    // Sum up all numbers in the array
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    console.log(sum); // Output: 15



combined example :-


const products = [
  { name: 'Laptop', price: 1000 },
  { name: 'Phone', price: 500 },
  { name: 'Tablet', price: 750 }
];

// Apply a 10% discount to each product and then sum up the total price
const totalDiscountedPrice = products
  .map(product => {
    return {
      ...product,
      price: product.price * 0.9
    };
  })
  .reduce((total, product) => total + product.price, 0);

console.log(totalDiscountedPrice); // Output: 2025



*/

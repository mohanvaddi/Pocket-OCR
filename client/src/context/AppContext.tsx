import React from 'react';

export interface RecentItem {
    type: 'upload' | 'link';
    imageLink: string;
    pdfLink: string;
    date: Date;
}

export interface UserInterface {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    recent: RecentItem[];
    isLoggedIn: boolean;
}
const user: UserInterface = {
    id: '',
    name: '',
    email: '',
    role: '',
    token: '',
    recent: [],
    isLoggedIn: false,
};

const initialState = {
    user,
};

type AppState = typeof initialState;

type Action =
    | { type: 'SET_USER'; payload: UserInterface }
    | { type: 'SET_LOGGEDIN'; payload: boolean }
    | { type: 'SET_TOKEN'; payload: string }
    | { type: 'SET_RECENTS'; payload: RecentItem[] }
    ;

const AppContext = React.createContext<{
    state: AppState;
    dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

const reducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'SET_LOGGEDIN':
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: action.payload,
                },
            };
        case 'SET_TOKEN':
            return {
                ...state,
                user: {
                    ...state.user,
                    token: action.payload,
                },
            };
        case 'SET_RECENTS':
            return {
                ...state,
                user:{
                    ...state.user,
                    recent: action.payload
                }
            }
        default:
            return state;
    }
};

export const AppContextProvider: React.FC = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;

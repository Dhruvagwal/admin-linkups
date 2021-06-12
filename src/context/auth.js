import React, {useContext, useState, useReducer} from 'react'

const Context = React.createContext()

const INITIAL_STATE = {auth: false}

const reducer = (state, action)=>{
    switch (action.type){
        case 'SET_AUTH':
            return {auth: action.authStatus}
        default:
            return state
    }
}

const AuthProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const setAuth = (authStatus)=>{
        dispatch({type:'SET_AUTH', authStatus})
    }


    return <Context.Provider value={{state, setAuth}}>
        {children}
    </Context.Provider>
}

const AuthConsumer = ()=>{
    return useContext(Context)
}

export {AuthProvider, AuthConsumer}
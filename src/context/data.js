import React, {useContext, useEffect, useReducer} from 'react'

import CONSTANT from 'navigation/navigationConstant'

import CONTEXT from './CONTEXT.json'

import {getUsersDetails, getCategory} from 'hooks/useData'

const Context = React.createContext()

const INITIAL_STATE = {profile:{}}

const reducer = (state, action)=>{
    switch (action.type){
        case CONTEXT.UPDATE:
            return {...state, profile:action.profile}
        default:
            return state
    }
}

const DataProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const Update = async ()=>{
        const {data}= await getUsersDetails()
        dispatch({type:CONTEXT.UPDATE, profile:data})
    }

    useEffect(()=>{
        Update()
    },[])


    return <Context.Provider value={{state, Update}}>
        {children}
    </Context.Provider>
}

const DataConsumer = ()=>{
    return useContext(Context)
}

export {DataProvider, DataConsumer}
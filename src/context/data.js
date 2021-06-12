import React, {useContext, useEffect, useReducer} from 'react'

import CONSTANT from 'navigation/navigationConstant'

import CONTEXT from './CONTEXT.json'
import {AuthConsumer} from './auth'

import {getUsersDetails, getCategory} from 'hooks/useData'

const Context = React.createContext()

const INITIAL_STATE = {profile:{}, load:false}

const reducer = (state, action)=>{
    switch (action.type){
        case CONTEXT.UPDATE:
            return {...state, profile:action.profile}
        case CONTEXT.CATEGORY:
            return {...state, category:action.category}
        case CONTEXT.LOAD:
            return {...state, load:action.load}
        case CONTEXT.SET_NAME:
            return {...state, currentRouteName: action.currentRouteName}
        default:
            return state
    }
}

const DataProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const {state:{auth}} =AuthConsumer()

    const Update = async (token)=>{
        const {data}= await getUsersDetails(token)
        dispatch({type:CONTEXT.UPDATE, profile:data})
    }
    const setCat = async (category)=>{
        dispatch({type:CONTEXT.CATEGORY, category})
    }
    const setLoad = async (load)=>{
        dispatch({type:CONTEXT.LOAD, load})
    }
    const setName = (currentRouteName)=>{
        dispatch({type:CONTEXT.SET_NAME, currentRouteName})
    }


    return <Context.Provider value={{state, Update, setCat, setLoad, setName}}>
        {children}
    </Context.Provider>
}

const DataConsumer = ()=>{
    return useContext(Context)
}

export {DataProvider, DataConsumer}
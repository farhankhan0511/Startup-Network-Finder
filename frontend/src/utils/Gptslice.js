import { createSlice } from "@reduxjs/toolkit";


const GptSearchSlice=createSlice({
    name:'GptSearch',
    initialState:{
        ShowGptSearch:false,
        Searched:null
    },
    reducers:{
        toggleGptview:(state)=>{
            state.ShowGptSearch=!state.ShowGptSearch;
        },
        addSearchedResult:(state,action)=>{
            state.Searched=action.payload;
        },
        clearSearchResult:(state)=>{
            state.searched=null;
        }
    }
})
export const {toggleGptview,clearSearchResult,addSearchedResult}=GptSearchSlice.actions
export default GptSearchSlice.reducer
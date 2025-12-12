import { createSlice } from "@reduxjs/toolkit";
import { off } from "process";

interface Leads{
    id :string,
    countryRegion :string,
    stateProvince:string,
    city:string,
    postalCode:string,
    Category:string,
    subCategory:string,
    fullName:string,
    offerType:string,
    payouts:number,
    isMerchantAllowedToRefuseLeads:boolean,
    LeadsLimit:number,
    materialModeration:string,
    tools:string,
    imageUrl:string,
    createdAt:string,
    updatedAt:string,
    deletedAt:string|null
}

interface LeadState{
    leads:Leads[];
}

const initialState:LeadState={
    leads:[]
}

const leadSlice = createSlice({
    name:"leads",
    initialState,
    reducers:{
        setLeads(state,action){
            state.leads = action.payload
        },
        addLead(state,action){
            state.leads.push(action.payload)
        },
        deleteLead(state,action){
            state.leads = state.leads.filter(lead => lead.id !== action.payload)
        },
        updateLead(state,action){
            state.leads = state.leads.map(lead => lead.id === action.payload.id ? action.payload : lead)
        }
    }
})

export const {addLead,deleteLead,setLeads,updateLead} = leadSlice.actions
export default leadSlice.reducer
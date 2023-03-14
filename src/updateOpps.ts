import { getPreferenceValues, getSelectedFinderItems } from "@raycast/api";
import axios from "axios";
import { sendUpdatedOpp } from "./close";
import { CloseQ } from "./listView";



// const leadId2 = 'lead_b6iEdTyzyY2UmuqMEP9Kwx6ZIU1m3fcDMVr1HTESJcC';

// const BASE_URL = "https://api.close.com/api/v1/"


export interface CloseLead{
    __object_type: string;
    id: string;
  }

export interface Preferences {
  apiKey?: string;
}

export interface LeadResult {
  name: string;
  id: string;
  opportunityID: string;
  opportunityNote:string;
}

export interface OpportunityID {
  id: string;
}
export interface CloseOpportunity{
  note:string;
  id: string;
}
var today = new Date();
var dd = String(today.getDate());
var mm = String(today.getMonth() + 1); 
const todayD = mm + '.' + dd;


export async function updateOpportunities(leadsArr:LeadResult[],newNote:string){
    for (const item of leadsArr){
        const updatedNote = `${todayD} - ${newNote}\n ${item.opportunityNote}`
        item.opportunityNote = updatedNote;
        console.log(`NEW LEAD ${item}`)
        await sendUpdatedOpp(item);
      }
      return leadsArr;
}
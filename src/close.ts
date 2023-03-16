import { getPreferenceValues, getSelectedFinderItems } from "@raycast/api";
import axios from "axios";
import { CloseQ } from "./noteSubmission";



const preferences = getPreferenceValues();
// Set the Close.io API key
const apiKey = preferences.token;

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


const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
};

// Create a function to retrieve the lead
export async function getLead(leadId: string) {
  const url = `https://api.close.com/api/v1/lead/${leadId}/`;
  try {
    const response = await axios.get(url, { headers });
    const leadName = await response.data.name
    return leadName;
  } catch (error) {
    console.error(error);
  }
}

export async function fetch(filters:object){
  //deleted key
const apiUrl = 'https://api.close.com/api/v1/data/search/';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
};

try {
  const res = await axios.post(apiUrl, filters, { headers})
  return res.data.data
} catch (e) {
  return [];
}
}


export async function extractLeadIDs(leads: CloseLead[]){
  const extractedLeads = leads.map(lead => ({ id: lead.id }));
  return extractedLeads

}

export async function giveLeadIDs(closeQObj:object){
  let leadResp:CloseLead[] = await fetch(closeQObj); //gets lead objects
  const extractedLeads = extractLeadIDs(leadResp) //returns object of leadIDs
  return extractedLeads
}

export async function getOpportunityIDs(leads: CloseLead[]){
  const leadIDs = extractLeadIDs(leads); 
  //const opps = fetchLeads() //retrieve opportunityIDs out of lead objects
}

export async function extractLeads(closeQObj:object) { //give list of LeadIDs and gets full Close Leads
  const xLeads:CloseLead[] = await fetch(closeQObj);
  const leads = [];
  for (const item of xLeads){
    const res = await fetchLead(item);
    const aLead:LeadResult = res;
    leads.push(aLead);
  }
  return leads
  }

  

  export async function fetchLead(lead: CloseLead | LeadResult){
  const apiUrl = `https://api.close.com/api/v1/lead/${lead.id}`;
  const data = {'lead_id':`${lead.id}`}
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
  };

  try {
    const res = await axios.get(apiUrl, { headers})
    console.log('FETCHING A LEAD')
    const newLead:LeadResult = {
      name:res.data.display_name,
      id:lead.id,
      opportunityID:res.data.opportunities[0]['id'],
      opportunityNote:res.data.opportunities[0]['note']
    }
    console.log(newLead.name)
    return newLead
  } catch (e) {
    console.log(e);
    const newLead:LeadResult = {
      name:'fail',
      id:'fail',
      opportunityID:'fail',
      opportunityNote:'fail'
    }
    return newLead;
  }
}

export async function sendUpdatedOpp(lead:LeadResult){
  const apiUrl = `https://api.close.com/api/v1/opportunity/${lead.opportunityID}`;
  const data = {'note':lead.opportunityNote}
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
  };

  try {
    const res = await axios.put(apiUrl, data,{ headers})
    console.log('UPDATING AN OPP')
    console.log(res.statusText)
  } catch (e) {
    console.log(e);
  }
}

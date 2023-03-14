import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Icon, List, LocalStorage,showToast, Toast, Form, ActionPanel, Action, popToRoot, LaunchProps } from "@raycast/api";
import { getLead, LeadResult,fetch,extractLeadIDs,extractLeads,giveLeadIDs } from "./close";
import { updateOpportunities } from "./updateOpps";
import { LeadExample } from "./LeadExample";

interface Lead {
  name: string;
  id: string;
  opportunityID: string;
  opportunityNote:string;
}

type ListProps = {
  //leadArrProp: Lead[];
  formCloseQuery:CloseQ;
  formNote:NoteObj;
}

interface Success {
  status: string;
}

interface closeLead {
    id: string;
  }

export interface CloseQ { //from the Form
    query: object;
}

export interface NoteObj{ //from the Form
    note:string;
}

interface Values { //from the Form
    formQueryTextArea: string;
    formNoteTextArea: string;
  }

export const ListView = ({formCloseQuery}:ListProps,{formNote}:ListProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [closeQuery, setCloseQuery] = useState<CloseQ>();
  const [newNote, setNewNote] = useState<NoteObj>()
  const [successStatus, setSuccessStatus] = useState<Success>() 
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    console.log("you made it!")
    // setLeads(leadArrProp);
    // console.log(leadArrProp)
    // function assignLeadIDs(leads:closeLead[]){
    //     const extractedLeads = leads.map(lead => ({ id: lead.id }));
    //     setLeads(extractedLeads)
    // }

    async function goFetch() { //grabs leadIDs from query
        let jQuery = closeQuery?.query!;
        const extractedLeadIDs = await giveLeadIDs(jQuery);
        //assignLeadIDs(extractedLeads)
      }

      async function getLeads() { //gets an array of lead objects (also calls fetch)
        let jQuery = closeQuery?.query!;
        const extractedLeads = await extractLeads(jQuery);

        let note = newNote?.note!
        const newLeads = updateOpportunities(extractedLeads,note)
        setLeads(newLeads);
          const newStatus:Success = {
            status:"Success!!!"};
          setSuccessStatus(newStatus);
        console.log(newLeads)
      }

      


    if(closeQuery !== undefined){ //checks for first run or not
      console.log('not undefined')
        //goFetch();
        getLeads();
    } 
  }, [closeQuery]); //changes on submit
  
  
  function handleSubmit(values: string) {
    const uQuery:CloseQ = ({
        query: JSON.parse(values)
    }) 
    console.log(values)
    // const uNote:NoteObj = ({
    //     note: values.formNoteTextArea
    // })
    setCloseQuery(uQuery);
    //setNewNote(uNote);
  }

  
  //dependencies change, list will run again. nothing inside = init. pass it state variables, update state with input or submission
// on click, put json into state closeQuery, has function for onSubmit to setState for closeQuery

  const leadExampleProps = leads[0]
  return (
    <List
    // actions={
    //   <ActionPanel>
    //     <Action title="Select" onAction={() => {handleSubmit}} />
    //   </ActionPanel>
    // }
      searchBarPlaceholder="Search for a stock, Rakiah"
    >
      <List.Section
            title={`${leads.length} Stock${leads.length > 1 ? "s" : ""} Found`}
          >
            {leads.map((result, i) => (
              <LeadExample key={`${result.name}${i}`} lead={result} />
            ))}
          </List.Section>
    </List>
  );

}
export default ListView;

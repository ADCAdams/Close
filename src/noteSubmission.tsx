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
  leadArrProp: Lead[];
  formCloseQuery:CloseQ;
  //formNote:NoteObj;
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

export const NoteSubmission = ({leadArrProp}:ListProps, {formCloseQuery}:ListProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [closeQuery, setCloseQuery] = useState<CloseQ>();
  const [newNote, setNewNote] = useState<NoteObj>()
  const [successStatus, setSuccessStatus] = useState<Success>() 
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    console.log("you made it!")


    async function goFetch() { //grabs leadIDs from query

        const extractedLeadIDs = await giveLeadIDs(formCloseQuery);
      }

      async function getLeads() { //gets an array of lead objects (also calls fetch)

        const extractedLeads = await extractLeads(formCloseQuery);
        setLeads(extractedLeads);
      }
      async function goUpdateOpps() { //gets an array of lead objects (also calls fetch)

        let note = newNote?.note!
        const newLeads = await updateOpportunities(leads,note)
        setLeads(newLeads);
          const newStatus:Success = {
            status:"Success!!!"};
          setSuccessStatus(newStatus);

      }

      


    if(newNote !== undefined){ //checks for first run or not
      console.log('note not undefined')
      goUpdateOpps();
      
    } else {
      console.log('note undefined')
      setLeads(leadArrProp)
      setCloseQuery(formCloseQuery);
    }
  }, [newNote]); //changes on submit
  
  
  function handleSubmit(values: Values) {

    const uNote:NoteObj = ({
        note: values.formNoteTextArea
    })

    setNewNote(uNote);
  }

 
  return (
  <Form
    actions={
      <ActionPanel>
        
        <Action.SubmitForm title="Update Opportunities" onSubmit={handleSubmit} />
        
      </ActionPanel>
    }
  >
      <Form.TextField
          id="formNoteTextArea"
          title="New Opportunity Note"
          placeholder="Do NOT include the date"
          // error={}
          // onChange={}
          // onBlur={(event) => {
          // if (event.target.value?.length == 0) {
          //     setNameError("The field should't be empty!");
          // } else {
          //     dropNameErrorIfNeeded();
          // }
          // }}
      />

    <Form.TextArea
          id="leadArea"
          title="Leads from Close Query"
          placeholder= {`lol `}
          info = "Leads shown here came from the previous close Query"
          value = {`${leads.map((result, i) => (
                        result.name
                    ))}`}
          // error={}
          // onChange={}
          // onBlur={(event) => {
          // if (event.target.value?.length == 0) {
          //     setNameError("The field should't be empty!");
          // } else {
          //     dropNameErrorIfNeeded();
          // }
          // }}
      />
    <Form.TextField
          id="successfulField"
          title={`${successStatus?.status}`}
          placeholder=""
          value={`${successStatus?.status}`}
      />
    </Form>









    // <List
    // // actions={
    // //   <ActionPanel>
    // //     <Action title="Select" onAction={() => {handleSubmit}} />
    // //   </ActionPanel>
    // // }
    //   searchBarPlaceholder="Search for a stock, Rakiah"
    // >
    //   <List.Section
    //         title={`${leads.length} Stock${leads.length > 1 ? "s" : ""} Found`}
    //       >
    //         {leads.map((result, i) => (
    //           <LeadExample key={`${result.name}${i}`} lead={result} />
    //         ))}
    //       </List.Section>
    // </List>
    
  );

}
export default NoteSubmission;

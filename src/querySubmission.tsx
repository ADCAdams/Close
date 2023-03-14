import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Icon, List, LocalStorage,showToast, Toast, Form, ActionPanel, Action, popToRoot, LaunchProps, getPreferenceValues, preferences } from "@raycast/api";
import { getLead, LeadResult,fetch,extractLeadIDs,extractLeads,giveLeadIDs } from "./close";
import { updateOpportunities } from "./updateOpps";
import { LeadExample } from "./LeadExample";
import { NoteSubmission} from "./noteSubmission"

interface Lead {
  name: string;
  id: string;
  opportunityID: string;
  opportunityNote:string;
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

const QuerySubmission = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [closeQuery, setCloseQuery] = useState<CloseQ>();
  const [newNote, setNewNote] = useState<NoteObj>()
  const [successStatus, setSuccessStatus] = useState<Success>() 
  const [searchText, setSearchText] = useState("");


  useEffect(() => {

    const preferences = getPreferenceValues();
    console.log(preferences)
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
        const newLeads = await updateOpportunities(extractedLeads,note)
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
  
  function handleSubmit(values: Values) {
    const uQuery:CloseQ = ({
        query: JSON.parse(values.formQueryTextArea)
    }) 
    console.log(values)
    const uNote:NoteObj = ({
        note: values.formNoteTextArea
    })
    setCloseQuery(uQuery);
    setNewNote(uNote);
  }

  
  //dependencies change, list will run again. nothing inside = init. pass it state variables, update state with input or submission
// on click, put json into state closeQuery, has function for onSubmit to setState for closeQuery
  
  const leadListProps = leads;
  const leadExampleProps = leads[0];


if (successStatus !== undefined && newNote !== undefined && closeQuery !==undefined){
  const queryProps:CloseQ = closeQuery;
  const noteProps:NoteObj = newNote;
  return <NoteSubmission formCloseQuery={queryProps} formNote={newNote} />;
}else{

}
  return (
    <Form
    actions={
      <ActionPanel>
        
        <Action.SubmitForm title="Update Opportunities" onSubmit={handleSubmit} />
        {/* <Action.Push
          title={`View example Lead`}
          target={<ListView formCloseQuery={queryProps} formNote={newNote} />}
          icon={Icon.Document}
          onPush={handleSubmit}
        /> */}
        
      </ActionPanel>
    }
  >
      <Form.TextArea
          id="formQueryTextArea"
          title="Close Query JSON"
          placeholder="Paste Close Query JSON here.
          limit: null,
          query: {
            negate: false,
            queries: ["
          info = "get it from Close and export a smartview!"
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
    <Form.TextField
          id="successfulField"
          title={`${successStatus?.status}`}
          placeholder=""
          value={`${successStatus?.status}`}
      />
  </Form>
  );






}
export default QuerySubmission;

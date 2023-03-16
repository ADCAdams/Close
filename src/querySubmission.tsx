import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Icon, List, LocalStorage,showToast, Toast, Form, ActionPanel, Action, popToRoot, LaunchProps, getPreferenceValues, preferences } from "@raycast/api";
import { getLead, LeadResult,fetch,extractLeadIDs,extractLeads,giveLeadIDs } from "./close";
import { updateOpportunities } from "./updateOpps";
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
        setLeads(extractedLeads);
        console.log(`first lead is ${extractedLeads[0].name}`)
          const newStatus:Success = {
            status:"Success!!!"};
          setSuccessStatus(newStatus);

        // let note = newNote?.note!
        // const newLeads = await updateOpportunities(extractedLeads,note)
        
        // console.log(newLeads)
      }

      


    if(closeQuery !== undefined){ //checks for first run or not
      console.log('not undefined')
        getLeads();

    } 
  }, [closeQuery]); //changes on submit
  
  function handleSubmit(values: Values) {
    const uQuery:CloseQ = ({
        query: JSON.parse(values.formQueryTextArea)
    })
    // const uNote:NoteObj = ({
    //     note: values.formNoteTextArea
    // })
    setCloseQuery(uQuery);
  }


var first:Boolean = true

if (successStatus !== undefined && closeQuery !==undefined && first == true){
  //console.log(`Success isssss  ${successStatus.status}`)
  //console.log(leads)
  const queryProps:CloseQ = closeQuery;
  const leadProps:Lead[] = leads;
  first = false;
  return <NoteSubmission leadArrProp={leadProps} formCloseQuery={queryProps} />;
}
  return (
    <Form
    actions={
      <ActionPanel>
        
        <Action.SubmitForm title="Query Leads" onSubmit={handleSubmit} />
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
      {/* <Form.TextField
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
      /> */}
  </Form>
  );






}
export default QuerySubmission;

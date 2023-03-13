import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon, List, Detail, LocalStorage, showToast, Toast, Form, ActionPanel, Action, popToRoot, LaunchProps } from "@raycast/api";
import { getLead, LeadResult,fetch,extractLeadIDs,extractLeads,giveLeadIDs } from "./close";
import { updateOpportunities } from "./updateOpps";
//import { getLeads } from "./future";

export interface Lead {
  name: string;
  id: string;
  opportunityID: string;
  opportunityNote:string;
}
type ExampleProps = {
  lead: Lead;
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

export const LeadExample = ({lead}:ExampleProps) => {
  const [aLeadExample, setLead] = useState<Lead>();


  const freshExample:Lead = lead;
  


  useEffect(() => {
    setLead(freshExample);
    console.log(freshExample)
    // async function goFetch() { //grabs leadIDs from query
    //     let jQuery = closeQuery?.query!;
    //     const extractedLeadIDs = await giveLeadIDs(jQuery);
    //     //assignLeadIDs(extractedLeads)
    //   }

    //   async function getLeads() { //gets an array of lead objects (also calls fetch)
    //     let jQuery = closeQuery?.query!;
    //     const extractedLeads = await extractLeads(jQuery);
    //     let note = newNote?.note!
    //     const newLeads = updateOpportunities(extractedLeads,note)
    //     //assignLeadIDs(extractedLeads)
    //     console.log(newLeads)
    //   }


    // if(closeQuery !== undefined){ //checks for first run or not
    //   console.log('not undefined')
    //     //goFetch();
    //     getLeads();
    //} 
  }, []); //changes on submit
  

  const md = `
 # ${aLeadExample?.name!}
 ---
- *Notes*: ${aLeadExample?.opportunityNote}
`;

  const closeURL = `https://app.close.com/lead/${aLeadExample?.id}`

  return (
    <Detail
      actions={
        <ActionPanel>
          {(
            <Action
              title="Refresh"
              onAction={() => {
                
              }}
            />
          )}
          {/* <Action.OpenInBrowser title="View on Google Finance" url={googleFinanceUrl} /> */}
        </ActionPanel>
      }
      markdown={md}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Link target={closeURL} text = "Close" title="View in Close" />
        </Detail.Metadata>
      }
    />
  );
};
export default LeadExample;

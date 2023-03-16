import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon, List, Detail, LocalStorage, showToast, Toast, Form, ActionPanel, Action, popToRoot, LaunchProps } from "@raycast/api";
import { getLead, LeadResult,fetch,extractLeadIDs,extractLeads,giveLeadIDs,fetchLead } from "./close";
import { updateOpportunities } from "./updateOpps";
//import { getLeads } from "./future";

export interface Lead {
  name: string;
  id: string;
  opportunityID: string;
  opportunityNote:string;
}
type ExampleProps = {
  leadEx: Lead;
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

export const LeadExample = ({leadEx}:ExampleProps) => {
  const [aLeadExample, setLead] = useState<Lead>();


  const freshExample:Lead = leadEx;
  


  useEffect(() => {
    console.log(freshExample)
    async function getTheLead(){
      const updatedLead = await fetchLead(freshExample);
      setLead(updatedLead)
    }
    getTheLead();
  }, []); //changes on submit
  

  const md = `
 # Lead Name: ${aLeadExample?.name!}
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

import './App.css';
import axios from "axios";
import { useAsyncCallback } from "react-async-hook";
import { useEffect, useState } from "react";

const init = async () => {
  try {
    const response = await axios.post("http://localhost:8080/init");
    return response.data
  } catch (e) {
    if (e.name === "AxiosError") {
      throw new Error(e.response?.data?.reason);
    } else {
      throw new Error("Unknown error occured" + e.toString());
    }
  }
}

const reset = async () => {
  try {
    const response = await axios.delete("http://localhost:8080/reset");
    return response.data
  } catch (e) {
    if (e.name === "AxiosError") {
      throw new Error(e.response?.data?.reason);
    } else {
      throw new Error("Unknown error occured" + e.toString());
    }
  }
}

const count = async () => {
  try {
    const response = await axios.get("http://localhost:8080/count");
    return response.data
  } catch (e) {
    if (e.name === "AxiosError") {
      throw new Error(e.response?.data?.reason);
    } else {
      throw new Error("Unknown error occured" + e.toString());
    }
  }
}

const total = async () => {
  try {
    const response = await axios.get("http://localhost:8080/total");
    return response.data
  } catch (e) {
    if (e.name === "AxiosError") {
      throw new Error(e.response?.data?.reason);
    } else {
      throw new Error("Unknown error occured" + e.toString());
    }
  }
}

const useAsyncSearchSimilarity = () => {
  const search = async (sentence) => {
    try {
      const response = await axios.post("http://localhost:8080/search", {sentence});
      return response.data
    } catch (e) {
      if (e.name === "AxiosError") {
        console.log(e.response.data.reason)
        throw new Error(e.response?.data?.reason);
      } else {
        throw new Error("Unknown error occured" + e.toString());
      }
    }
  }

  return useAsyncCallback(search)
}

const useAsyncUpsertIssue = () => {
  const search = async (issueKey, issueText) => {
    try {
      const response = await axios.post(`http://localhost:8080/issue/upsert/${issueKey}`, {text: issueText});
      return response.data
    } catch (e) {
      if (e.name === "AxiosError") {
        console.log(e.response.data.reason)
        throw new Error(e.response?.data?.reason);
      } else {
        throw new Error("Unknown error occured" + e.toString());
      }
    }
  }

  return useAsyncCallback(search)
}

const useAsyncDeleteIssue = () => {
  const search = async (issueKey) => {
    try {
      const response = await axios.delete(`http://localhost:8080/issue/delete/${issueKey}`);
      return response.data
    } catch (e) {
      if (e.name === "AxiosError") {
        console.log(e.response.data.reason)
        throw new Error(e.response?.data?.reason);
      } else {
        throw new Error("Unknown error occured" + e.toString());
      }
    }
  }

  return useAsyncCallback(search)
}

const useAsyncRestoreIssue = () => {
  const search = async (issueKey) => {
    try {
      const response = await axios.post(`http://localhost:8080/issue/restore/${issueKey}`);
      return response.data
    } catch (e) {
      if (e.name === "AxiosError") {
        console.log(e.response.data.reason)
        throw new Error(e.response?.data?.reason);
      } else {
        throw new Error("Unknown error occured" + e.toString());
      }
    }
  }

  return useAsyncCallback(search)
}


const tasks = [
  {
    "Summary": "Correct a typo in the Export Boards modal window",
    "Description": [
      "Identify the text element containing the typo",
      "Change the text from 'Only accepted us has access' to 'Only accepted users have access'",
      "Ensure the text correction aligns with the design and layout of the modal",
      "Test the updated modal for visual and functional consistency",
      "Deploy the change to the staging environment for further testing"
    ]
  },
  {
    "Summary": "UI Enhancements for Bulk Boards Export Feature",
    "Description": [
      "Add a 'Learn more' link leading to help documentation near the 'Bulk boards export' title.",
      "Implement a tooltip for each export format/type to provide additional information to the user.",
      "Include information about the option to download boards in PDF format for visual exports, with emphasis on it being important, marked with an exclamation icon.",
      "Move and update the option for including media to a different UI location and change the text to 'Include media (images and PDF files)'."
    ]
  },
  {
    "Summary": "Implement an Export Progress Feature",
    "Description": [
      "Create a new UI element indicating 'export in progress'.",
      "This element should be visually distinct and noticeable.",
      "Ensure the element is placed in a prominent location for user visibility.",
      "The progress indicator must remain on screen until the export process is completed.",
      "Match the style and colors with the existing design language of the user interface."
    ]
  }
]

function Progress({ initLoading, issuesToDownload }) {
  const { loading: countLoading, result: countResult, error: countError, execute: countExecute } = useAsyncCallback(count);
  const [issuesProcessed, setIssuesProcessed] = useState(0)

  useEffect(() => {
    let id;
    if (initLoading) {
      id = setInterval(() => {
        if (!countLoading) {
          if (countResult?.result !== count && countResult?.result) {
            setIssuesProcessed(countResult?.result)
          }
          countExecute()
        }
      }, 1000); // Execute every second
    }
    return () => clearInterval(id);
  }, [initLoading, countExecute, countLoading, countResult?.result]);

  return (initLoading && issuesToDownload && <p>{`Downloading issues and populating database: ${issuesProcessed}/${issuesToDownload}`}</p>);
}

function App() {
  const { loading: initLoading, result: initResult, error: initError, execute: initExecute } = useAsyncCallback(init);
  const { loading: resetLoading, result: resetResult, error: resetError, execute: resetExecute } = useAsyncCallback(reset);
  const { loading: totalLoading, result: totalResult, error: totalError, execute: totalExecute } = useAsyncCallback(total);
  const { loading: searchLoading, result: searchResult, error: searchError, execute: searchExecute } = useAsyncSearchSimilarity();
  const { loading: upsertLoading, result: upsertResult, error: upsertError, execute: upsertExecute } = useAsyncUpsertIssue();
  const { loading: deleteLoading, result: deleteResult, error: deleteError, execute: deleteExecute } = useAsyncDeleteIssue();
  const { loading: restoreLoading, result: restoreResult, error: restoreError, execute: restoreExecute } = useAsyncRestoreIssue();

  const isLoading = initLoading || resetLoading || searchLoading || totalLoading || upsertLoading || deleteLoading || restoreLoading;

  return (
    <div className="App" style={{ width: 500, margin: "auto"}}>
      <div style={{ display: "flex" }}>
        <button onClick={() => {totalExecute().then(initExecute);}} disabled={isLoading}>Init</button>
        <button onClick={resetExecute} disabled={isLoading}>Reset</button>
        <Progress initLoading={initLoading} issuesToDownload={totalResult?.result}/>
      </div>
      {!!initError && <p style={{color: "red"}}>${initError.message}</p>}
      {!!resetError && <p style={{color: "red"}}>${resetError.message}</p>}
      <form onSubmit={(e) => { 
        e.preventDefault();
        const formData = new FormData(e.target);
        searchExecute(formData.get("search"))
      }} style={{ display: "flex" }}>
        <input type="text" placeholder="Search for similarity" name="search" style={{ width: "80%"}}/>
        <button disabled={isLoading}>Search</button>
      </form>
      <div>
        {searchResult?.result && searchResult.result?.length > 0 && searchResult.result.map((issue) => {
          const { issueKey, issueText, distance } = issue;
          return (
            <p key={issueKey} style={{ display: "flex", justifyContent: "space-between", textAlign: 'left'}}><span style={{ maxWidth: "70%"}}>{`${issueKey}: ${issueText} `}</span><span style={{color: "red"}}>{`Similarity: ${((1-distance) * 100).toFixed(1)}%`}</span></p>
          )
        })}
      </div>
      <div style={{ textAlign: "left"}}> 
        <p><b>Potenial issues texts suggested by AI</b></p>
        <ul>
          {tasks.map(({ Summary, Description }) => {
            // return <li>{`${Summary} ${Description.join(" ")}`}</li>
            return <li>{`${Summary}`}</li>
          })}
        </ul>
      </div>
      <h4 style={{ textAlign: "left" }}>Create or update issue</h4>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        upsertExecute(formData.get("issueKey"), formData.get("issueText"))
      }} style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        <label for="issueKey">Issue key</label>
        <input type="text" name="issueKey" placeholder='Issue key...'></input>
        <label for="issueText">Issue text</label>
        <input type="text" name="issueText" placeholder='Issue text...'></input>
        <button disabled={isLoading}>Upsert</button>
      </form>
      <h4 style={{ textAlign: "left" }}>Delete issue</h4>
      <form onSubmit={(e) => { 
        e.preventDefault();
        const formData = new FormData(e.target);
        deleteExecute(formData.get("deleteIssue"))
      }} style={{ display: "flex" }}>
        <input type="text" placeholder="Issue key..." name="deleteIssue"/>
        <button disabled={isLoading}>Delete</button>
      </form>
      <h4 style={{ textAlign: "left" }}>Restore issue</h4>
      <form onSubmit={(e) => { 
        e.preventDefault();
        const formData = new FormData(e.target);
        restoreExecute(formData.get("restoreIssue"))
      }} style={{ display: "flex" }}>
        <input type="text" placeholder="Issue key..." name="restoreIssue"/>
        <button disabled={isLoading}>Restore</button>
      </form>
    </div>
  );
}

export default App;

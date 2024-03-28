import express from "express"
import cors from "cors"
import dotenv from 'dotenv'

import { init } from "./init.js";
import { reset } from "./reset.js";
import { searchSimilarity } from "./search-similarity.js";
import { getChromaCollection } from "./chroma-collection.js";
import { issueSearch } from "./api.js";

import { JQL } from './const.js';
import { upsertIssue } from "./upsert-issue.js";
import { deleteIssue } from "./delete-issue.js";
import { restoreIssue } from "./restore-issue.js";

dotenv.config()

const app = express();
const port = 8080;

const allowedOrigins = ['http://localhost:3000'];

app.use(express.json())

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.delete("/reset", async function (req, res) {
  try {
    const isReset = await reset();
    if (isReset) {
      res.status(202).send({ deleted: true })
    } else {
      res.status(500).send({ deleted: false, reason: "Failed to reset"})
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ deleted: false, reason: e.message ?? "Unknown"})
  }
})

app.post("/init", async function (req, res) {
  try {
    await init();
    res.status(201).send({ initiated: true })
  } catch (e) {
    res.status(500).send({ initiated: false, reason: e.message ?? "Unknown" })
  }
})

app.post("/search", async function (req, res) {
  try {
    const searchResult = await searchSimilarity(req.body.sentence)
    res.status(200).send({ result: searchResult })
  } catch (e) {
    console.log(e)
    res.status(500).send({ reason: e.message ?? "Unknown"})
  }
})

app.get("/count", async function (req, res) {
  try {
    const collection = await getChromaCollection();
    const collectionCount = await (collection).count();
    res.status(200).send({ result: collectionCount })
  } catch (e) {
    console.log(e)
    res.status(500).send({ reason: e.message ?? "Unknown"})
  }
})

app.get("/total", async function (req, res) {
  try {
    const issuesTotal = (await issueSearch({maxResults: 1, startAt: 0, jql: JQL}))["total"]
    res.status(200).send({ result: issuesTotal })
  } catch (e) {
    console.log(e)
    res.status(500).send({ reason: e.message ?? "Unknown"})
  }
})

app.post("/issue/upsert/:issueKey", async function (req, res) {
  try {
    const text = req.body.text;
    const issueKey = req.params.issueKey;
    await upsertIssue(text, issueKey);
    res.status(201).send({ result: true })
  } catch(e) {
    res.status(500).send({ result: false, reason: e.message ?? "Unknown"})
  }
})

app.delete("/issue/delete/:issueKey", async function (req, res) {
  try {
    const issueKey = req.params.issueKey;
    await deleteIssue(issueKey);
    res.status(201).send({ result: true })
  } catch(e) {
    res.status(500).send({ result: false, reason: e.message ?? "Unknown"})
  }
})

app.post("/issue/restore/:issueKey", async function (req, res) {
  try {
    const issueKey = req.params.issueKey;
    await restoreIssue(issueKey);
    res.status(201).send({ result: true })
  } catch(e) {
    res.status(500).send({ result: false, reason: e.message ?? "Unknown"})
  }
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
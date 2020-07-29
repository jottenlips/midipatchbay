import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { useMIDI } from "react-use-midi/lib";

export const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <ul>
          <li>
            <Link to="/">Play Synth</Link>
          </li>
          <li>
            <Link to="/synth">Synth Output</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/synth">
            <Synth />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

// You can think of these components as "pages"
// in your app.

function Home() {
  const message = JSON.stringify({
    note: "C4",
  });

  return (
    <div>
      <h2>Play My Synth Remotely</h2>
      <button
        onClick={() => {
          fetch("https://patchbay.pub/pubsub/midichat", {
            method: "POST",
            body: `data: ${message}\n\n`,
          });
        }}
      >
        C4
      </button>
    </div>
  );
}

function Synth() {
  const [output, setOutput] = useState();
  const midi = useMIDI();
  const evtSource = new EventSource(
    "https://patchbay.pub/pubsub/midichat?mime=text%2Fevent-stream&persist=true"
  );
  evtSource.onmessage = function (event) {
    console.log(event.data);
    midi.getOutputById(output).playNote("C3");
  };

  return (
    <div>
      <h2>Output</h2>
      <select
        value={output}
        onChange={(e) => {
          setOutput(e.target.value);
        }}
      >
        {midi.outputs &&
          midi.outputs.map((out) => (
            <option key={out.id} value={out.id}>
              {out.name}
            </option>
          ))}
      </select>

      <button
        style={{
          padding: "20px",
          margin: "20px",
        }}
        onClick={() => {
          output &&
            midi.getOutputById &&
            midi.getOutputById(output).playNote("C3");
        }}
      >
        Play C3 to output
      </button>
    </div>
  );
}

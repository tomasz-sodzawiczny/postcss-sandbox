import React from "react";
import ReactDOM from "react-dom";
import PostCSS from "./PostCSS";
import Textarea from "react-autosize-textarea";

import "./styles.css";

const exampleInput = `.a {
  size: calc(3 * 10px);
  color: blue color(blue l(20%));
}`;

const updateUrl = input => {
  const url = new URL(window.location);
  url.searchParams.set("input", input);
  window.history.replaceState({}, "", url.toString());
};

const getInputFromUrl = () => {
  const url = new URL(window.location);
  return url.searchParams.get("input");
};

class App extends React.Component {
  state = {
    input:
      getInputFromUrl() || localStorage.getItem("inputcss") || exampleInput,
    results: []
  };

  onInputChange = event => {
    const value = event.target.value;
    localStorage.setItem("inputcss", value);
    this.setState({ input: value });
    updateUrl(value);
  };

  render() {
    return (
      <div>
        <Textarea
          className="box code"
          value={this.state.input}
          onChange={this.onInputChange}
          autoFocus
        />

        <PostCSS plugins={this.props.plugins} input={this.state.input}>
          {({ results, processing }) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.map((result, id) => {
                if (result.type === "css") {
                  return (
                    <div className="box" key={id}>
                      <h2 className="box__header">
                        {result.plugin || "(unknown plugin)"}
                      </h2>
                      <pre className="code">{result.css}</pre>
                    </div>
                  );
                }
                if (result.type === "error") {
                  return (
                    <pre key={id} className="box box--error css">
                      {result.message}
                    </pre>
                  );
                }
                return null;
              })}
            </div>
          )}
        </PostCSS>
      </div>
    );
  }
}

export default function renderApp(plugins) {
  const rootElement = document.getElementById("root");
  ReactDOM.render(<App plugins={plugins} />, rootElement);
}

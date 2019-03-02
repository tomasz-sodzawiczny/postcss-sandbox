import React from "react";
import postcss from "postcss";

const process = async (css, plugins) => {
  const results = [];

  let nextInput = css;
  for (const plugin of plugins) {
    try {
      const result = await postcss()
        .use(plugin)
        .process(nextInput);
      results.push({
        type: "css",
        css: result.css,
        plugin: result.lastPlugin.postcssPlugin
      });
      nextInput = result.css;
    } catch (e) {
      const message = e.toString();
      results.push({ type: "error", message });
      break;
    }
  }
  return results;
};

export default class PostCSS extends React.Component {
  state = {
    processing: 0,
    results: []
  };

  scheduleUpdate = async (input, plugins) => {
    this.setState(state => ({
      processing: state.processing + 1
    }));
    process(input, plugins).then(newResults =>
      this.setState(state => ({
        processing: state.processing - 1,
        // if some "new" processing already started don't update
        results: state.processing === 1 ? newResults : state.results
      }))
    );
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.input !== prevProps.input ||
      this.props.plugins !== prevProps.plugins
    ) {
      this.scheduleUpdate(this.props.input, this.props.plugins);
    }
  }

  componentDidMount() {
    this.scheduleUpdate(this.props.input, this.props.plugins);
  }

  render() {
    return this.props.children({
      processing: !!this.state.processing,
      results: this.state.results
    });
  }
}

import React, { useEffect } from "react";
import { EditorState } from "draft-js";
import SimpleDecorator from "draft-js-simpledecorator";
import { Fragmenter } from "./fragments";

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}

export function WordMatcher(fragments, items, style, contentBlock) {
  const text = contentBlock.getText();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const regex = new RegExp(`\\b${escapeRegExp(item)}\\b`, "g");
    let matchArr = null;
    while ((matchArr = regex.exec(text)) !== null) {
      const match = matchArr[0];
      const start = matchArr.index;
      const end = start + match.length;
      fragments.add(style, [start, end]);
    }
  }
}

export function SentenceMatcher(fragments, items, style, contentBlock) {
  const text = contentBlock.getText();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const start = text.indexOf(item);
    const end = start + item.length;
    if (start === -1) {
      continue;
    }
    fragments.add(style, [start, end]);
  }
}

export function MultiHighlightDecorator(config) {
  return new SimpleDecorator(
    function strategy(contentBlock, callback) {
      const fragments = new Fragmenter(config.styles);
      for (const rule of config.rules) {
        rule.matcher(fragments, rule.words, rule.style, contentBlock);
      }
      if (fragments.isMultiply()) {
        const ranges = fragments.getDecoratedRanges();
        for (const range of ranges) {
          let style = {};
          for (const s of range.styles) {
            style = { ...style, ...config.styles[s] };
          }
          callback(range.range[0], range.range[1], style);
        }
      } else {
        const singleRanges = fragments.getSimpleRanges();
        if (singleRanges) {
          for (const range of singleRanges.range) {
            callback(range[0], range[1], config.styles[singleRanges.style]);
          }
        }
      }
    },

    function component(props) {
      return <span style={{ ...props }}>{props.children}</span>;
    }
  );
}

export function useMultiHighlightConfigChange(
  highlightConfig,
  editorState,
  setEditorState
) {
  useEffect(() => {
    if (highlightConfig) {
      setEditorState(
        EditorState.set(editorState, {
          decorator: MultiHighlightDecorator(highlightConfig),
        })
      );
    }
  }, [highlightConfig]);
}

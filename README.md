# Multi-inline highlighting for DraftJS editor

Allows to do multi selections in DraftJS editor via a custom decorator.

The source for full demo example is [here](https://github.com/buchslava/draft-js-multi-inline-highlight-demo).

## Install

`npm i draft-js-multi-inline-highlight`

or

`yarn add draft-js-multi-inline-highlight`

# Usage

## Import

```typescript
import {
  MultiHighlightDecorator,
  WordMatcher,
  SentenceMatcher,
  MultiHighlightConfig,
} from "draft-js-multi-inline-highlight";
```

## Configuration

```typescript
const initHighlightConfig: MultiHighlightConfig = {
  rules: [
    {
      content: ["His back begins to ache, but he knows he can bear it."],
      style: "yellow",
      matcher: SentenceMatcher,
    },
    {
      content: ["and"],
      style: "red",
      matcher: WordMatcher,
    },
    {
      content: ["pulled", "knows"],
      style: "blue",
      matcher: WordMatcher,
    },
  ],
  styles: hightlightStyles,
};
```

## Initialization

```typescript
const [highlightConfig, setHighlightConfig] = useState<MultiHighlightConfig>(
  initHighlightConfig
);
const [editorState, setEditorState] = useState(
  EditorState.createWithContent(
    contentState,
    MultiHighlightDecorator(highlightConfig)
  )
);
```

## Chage highlighting state according to the new configuration

```typescript
useEffect(() => {
  if (highlightConfig) {
    setEditorState(
      EditorState.set(editorState, {
        decorator: MultiHighlightDecorator(highlightConfig),
      })
    );
  }
}, [highlightConfig]);
```

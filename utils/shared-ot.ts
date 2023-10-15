import { diff_match_patch } from "diff-match-patch";
import { insert, remove, TextOp } from "ot-text-unicode";

export interface TextOperationSet {
  version: number;
  operations: TextOp;
}

export interface TextOperationSetWithCursor extends TextOperationSet {
  cursor?: number;
}

export function createTextOpFromTexts(
  prevText: string,
  currentText: string
): TextOp {
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(prevText, currentText);
  //dmp.diff_cleanupSemantic(diffs);

  var textop: TextOp = [];

  var skipn: number = 0;

  for (const [operation, text] of diffs) {
    if (operation === 0) {
      skipn += text.length;
    } else if (operation === -1) {
      textop = [...textop, ...remove(skipn, text)];
      skipn = 0;
    } else {
      textop = [...textop, ...insert(skipn, text)];
      skipn = 0;
    }
  }
  return textop;
}

import { diff_match_patch } from "diff-match-patch";
import { type, insert, remove, TextOp } from "ot-text-unicode";

export interface TextOperationSet {
  version: number;
  operations: TextOp;
}

export interface TextOperationSetWithCursor extends TextOperationSet {
  cursor?: number;
}

class CircularArray<T> {
  private array: Array<T>;
  private last: number; // index of last element

  constructor(capacity: number) {
    this.array = new Array(capacity);
    this.last = -1;
  }

  public add(value: T): void {
    this.last = (this.last + 1) % this.array.length;
    this.array[this.last] = value;
  }

  public getLatest(): T {
    return this.array[this.last];
  }

  public search(predicate: (value: T) => boolean): T | null {
    for (let i = 0; i < this.array.length; i++) {
      const index = (this.last - i) % this.array.length;
      if (predicate(this.array[index])) {
        return this.array[index];
      }
    }
    return null;
  }

  public reduceFromMatchedPredicateToLatest(
    predicate: (value: T) => boolean,
    callbackFn: (previousValue: T, currentValue: T) => T,
    initialValue: T
  ): T {
    for (let i = 0; i < this.array.length; i++) {
      const index = (this.last - i + this.array.length) % this.array.length;
      if (predicate(this.array[index])) {
        const startIndex = index;
        const endIndex = this.last;
        if (startIndex <= endIndex) {
          return this.array
            .slice(startIndex, endIndex + 1)
            .reduce(callbackFn, initialValue);
        } else {
          return this.array
            .slice(startIndex)
            .concat(this.array.slice(0, endIndex + 1))
            .reduce(callbackFn, initialValue);
        }
      }
    }
    const start = (this.last + 1) % this.array.length;
    return this.array
      .slice(start)
      .concat(this.array.slice(0, this.last + 1))
      .reduce(callbackFn, initialValue);
  }

  public get length(): number {
    return this.array.length;
  }
}

export class OpHistoryMap {
  private map: Record<string, CircularArray<TextOperationSet>> = {};

  public add(room_id: string, opHistory: TextOperationSet): void {
    if (!this.map[room_id]) {
      this.map[room_id] = new CircularArray(10);
    }
    this.map[room_id].add(opHistory);
  }

  public getLatest(room_id: string): TextOperationSet | null {
    if (!this.map[room_id]) {
      return null;
    }
    return this.map[room_id].getLatest();
  }

  public getCombinedTextOpFromVersionToLatest(
    room_id: string,
    version: number
  ): TextOp {
    const room = this.map[room_id];
    const latestVersion = room.getLatest().version;

    if (version - 1 === latestVersion) {
      return room.getLatest()!.operations;
    }

    // Combine operations from the given version to the latest version
    return room.reduceFromMatchedPredicateToLatest(
      (opHistory) => {
        return version === opHistory.version;
      },
      (x, y) => {
        return {
          operations: type.compose(x.operations, y.operations),
          version: y.version,
        };
      },
      { operations: [], version: 0 }
    ).operations;
  }

  public checkIfLatestVersion(room_id: string, version: number): boolean {
    if (!this.map[room_id]) {
      return true;
    }
    const latest = this.map[room_id].getLatest();
    if (!latest) {
      return true;
    }
    return latest.version === version;
  }

  public search(room_id: string, version: number): TextOperationSet | null {
    if (!this.map[room_id]) {
      return null;
    }
    return this.map[room_id].search(
      (opHistory) => opHistory.version === version
    );
  }
}

export function createTextOpFromTexts(text1: string, text2: string): TextOp {
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(text1, text2);
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

/**
 * Returns transformed operations
 * @param latestOp Text 1 to 3
 * @param mergedOp Text 1 to 2
 * @returns (transformed Text 1 to 3, transformed Text 1 to 2)
 * Transformed text 1 to 3 to apply to text 2
 * Transformed text 1 to 2 to apply to text 3
 */
export function getTransformedOperations(latestOp: TextOp, mergedOp: TextOp) {
  return [
    type.transform(latestOp, mergedOp, "left"),
    type.transform(mergedOp, latestOp, "right"),
  ];
}

export function transformPosition(cursor: number, op: TextOp): number {
  return type.transformPosition(cursor, op);
}

function test() {
  const text1 = "hello world";
  const text2 = "good day hi everyone and the world";
  const text3 = "good morning to the world and all who are in it";
  const expected =
    "hi everyone good morning to the world and all who are in it"; /// or some gibberish similiar to this

  const history_db = new OpHistoryMap();

  history_db.add("room1", {
    version: 0.1,
    operations: insert(0, text1),
  });

  /// Text 3 sent on version 0.1
  history_db.search("room1", 0.1);

  const text1to2op = createTextOpFromTexts(text1, text2);
  console.log(text1to2op);

  history_db.add("room1", {
    version: 0.2,
    operations: text1to2op,
  });

  const text1to3op = createTextOpFromTexts(text1, text3);
  console.log(text1to3op);

  const newOp = type.transform(text1to3op, text1to2op, "left");
  console.log(newOp);
  console.log(type.apply(text2, newOp));

  const newOp2 = type.transform(text1to2op, text1to3op, "right");
  console.log(newOp2);
  console.log(type.apply(text3, newOp2));

  // favour text1to3op over text1to2op on side param
  // outcome is same

  console.log("------------------");

  //Compose
  const x = createTextOpFromTexts("Hi", "hai");
  const y = createTextOpFromTexts("hai", "hbaye");
  console.log(x);
  console.log(y);
  const z = type.compose(x, y);
  console.log(z);
  console.log(type.apply("Hi", z));

  const z2 = type.compose(y, x);
  console.log(z2);
  console.log(type.apply("Hi", z2));

  console.log("------------------");

  console.log(text1to2op);
  console.log(text1to3op);
  const newOp3 = type.compose(text1to2op, text1to3op);
  console.log(newOp3);
  console.log(type.apply(text1, newOp3));
}

if (require.main === module) {
  test();
}

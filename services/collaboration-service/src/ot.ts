interface OpHistory {
  version: number;
  operations: Array<Operation>;
}

interface Operation {
  type: "insert" | "delete";
  position: number;
  value: string;
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

  public get length(): number {
    return this.array.length;
  }
}

class OpHistoryMap {
  private map: Record<string, CircularArray<OpHistory>> = {};

  public add(room_id: string, opHistory: OpHistory): void {
    if (!this.map[room_id]) {
      this.map[room_id] = new CircularArray(10);
    }
    this.map[room_id].add(opHistory);
  }

  public getLatest(room_id: string): OpHistory | null {
    if (!this.map[room_id]) {
      return null;
    }
    return this.map[room_id].getLatest();
  }

  public search(room_id: string, version: number): OpHistory | null {
    if (!this.map[room_id]) {
      return null;
    }
    return this.map[room_id].search(
      (opHistory) => opHistory.version === version
    );
  }
}

function transformOperations(
  operations_x: Array<Operation>,
  operations_y: Array<Operation>
) {
  // TODO
}

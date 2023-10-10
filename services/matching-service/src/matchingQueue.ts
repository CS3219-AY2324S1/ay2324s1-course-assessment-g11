export class MatchingQueue {
  private queue: number[] = [];

  enqueue(userId: number) {
    this.queue.push(userId);
  }

  dequeue(): number | undefined {
    return this.queue.shift();
  }

  getQueue(): number[] {
    return this.queue;
  }
}

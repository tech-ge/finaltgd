export interface ReviewTask {
  accountId: number;
  submittedAt: Date;
  reason: string;
}

export interface ReviewDecision {
  accountId: number;
  reviewerId: number;
  approved: boolean;
  notes: string;
  decidedAt: Date;
}

export class ManualReview {
  private readonly queue: ReviewTask[] = [];
  private readonly decisions: ReviewDecision[] = [];

  enqueue(task: ReviewTask): void {
    if (this.queue.some((t) => t.accountId === task.accountId)) {
      throw new Error('review_task_already_queued');
    }
    this.queue.push(task);
  }

  pending(): ReviewTask[] {
    return [...this.queue];
  }

  decide(decision: ReviewDecision): void {
    const idx = this.queue.findIndex((t) => t.accountId === decision.accountId);
    if (idx === -1) {
      throw new Error('review_task_not_found');
    }
    this.queue.splice(idx, 1);
    this.decisions.push(decision);
  }

  history(): ReviewDecision[] {
    return [...this.decisions];
  }
}

// Walks an ordered list of yes/no questions one at a time: Yes shows that step's
// answer, No moves on. The last step has no question to refuse, so it shows its
// answer at once. A jeff-ui candidate (jeff-ui-project/TODO.md).

import { useState } from "react";
import { Button } from "jeff-ui";
import { InlineMd } from "../session/MarkdownView.js";

export interface FlowStep {
  question: string;
  answer: string;
}

export function DecisionFlow({ steps }: { steps: readonly FlowStep[] }) {
  const [at, setAt] = useState(0);
  const [yes, setYes] = useState(false);
  const step = steps[at];
  if (!step) return null;
  const shown = yes || at === steps.length - 1;
  return (
    <div className="pg-flow">
      <ol className="pg-flow-dots" aria-label={`Question ${at + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <li key={s.question} className={i <= at ? "pg-flow-dot pg-flow-dot-on" : "pg-flow-dot"} />
        ))}
      </ol>
      <p className="pg-flow-q">{step.question}</p>
      {shown && (
        <div className="pg-flow-a">
          <InlineMd md={step.answer} />
        </div>
      )}
      <div className="pg-flow-btns">
        {shown ? (
          <Button
            variant="ghost"
            onClick={() => {
              setAt(0);
              setYes(false);
            }}
          >
            Start over
          </Button>
        ) : (
          <>
            <Button variant="primary" onClick={() => setYes(true)}>
              Yes
            </Button>
            <Button onClick={() => setAt(at + 1)}>No</Button>
          </>
        )}
      </div>
    </div>
  );
}

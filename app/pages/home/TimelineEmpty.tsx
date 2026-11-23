import { EmptyState, Prose } from "jeff-ui";
// Shown when the data carries no dated beats the timeline can place: a fresh
// template, not an error.

export function TimelineEmpty() {
  return (
    <EmptyState
      className="chart-empty"
      action={
        <Prose>
          <p>
            This view plots your campaign's dated beats. Nothing carries a date the timeline can
            place yet.
          </p>
          <p>Add any of these, then this page reloads on its own:</p>
          <ul>
            <li>
              <code>timeline_date</code> on a <code>type: event</code> in <code>data/events/</code>{" "}
              or <code>historian/events/</code>
            </li>
            <li>
              <code>in_world_end_date</code> on a <code>type: session</code> in{" "}
              <code>historian/sessions/</code> (written by <code>/recap</code>)
            </li>
            <li>
              a <code>chronicle:</code> beat on any historian/scheduler entity
            </li>
          </ul>
        </Prose>
      }
    >
      No timeline yet
    </EmptyState>
  );
}

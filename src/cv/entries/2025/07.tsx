import { CVEntry } from '../../CVEntry';

export default function July2025() {
  return (
    <>
      <CVEntry tooltip="Given an image for a flavor and service, ensure it is shared to different regions and accounts at scale">
        Designed and implemented first event-based workload — image distribution service
      </CVEntry>
      <CVEntry tooltip="Horizontal scale with no data duplication or deletion guarantees">
        Built reliable distributed image sharing across regions and accounts
      </CVEntry>
    </>
  );
}

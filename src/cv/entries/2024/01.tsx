import { CVEntry } from '../../CVEntry';

export default function January2024() {
  return (
    <>
      <CVEntry tooltip="Moves most post-transaction operations off the critical transaction path via async event consumers">
        Designed event-based consumer architecture to reduce pressure on
        transaction services
      </CVEntry>
      <CVEntry>
        Built consumer that transforms received data for Non Real-time Fraud
        Detection system
      </CVEntry>
      <CVEntry tooltip="Reduced field copy count per transaction from 30 to 0 using runtime annotation-based filtering">
        Optimised transaction service producer — eliminated all field copy
        operations
      </CVEntry>
    </>
  );
}

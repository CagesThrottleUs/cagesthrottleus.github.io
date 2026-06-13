import { CVEntry } from '../../CVEntry';

export default function December2023() {
  return (
    <>
      <CVEntry tooltip="Latency reduced from 100ms to 1ms on the previous system">
        Delivered Operational Compliance system with order-of-magnitude latency
        improvement
      </CVEntry>
      <CVEntry tooltip="New hash key algorithm for effective Aerospike data sharding — not shipped in time">
        Worked on hash key algorithm for effective data sharding
      </CVEntry>
    </>
  );
}

import { CVEntry } from '../../CVEntry';

export default function February2024() {
  return (
    <>
      <CVEntry tooltip="Aerospike produces events keyed to Kafka partitions; consumer syncs to backup data store">
        Built data-syncing consumer as backup store for all Aerospike changes
      </CVEntry>
      <CVEntry tooltip="Parallelisation with per-key ordering to ensure consistent state; minimal config per table">
        Designed per-key synchronised consumer achieving 10k TPS
      </CVEntry>
    </>
  );
}

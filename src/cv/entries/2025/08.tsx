import { CVEntry } from '../../CVEntry';

export default function August2025() {
  return (
    <>
      <CVEntry tooltip="POSIX-style wc clone in C++20; ~1.7k LOC; supports -l, -w, -c, -m, multiple files, stdin, and right-aligned totals">
        Completed John Crickett challenge: Word Count tool in C++20
      </CVEntry>
      <CVEntry tooltip="Memory-mapped files (Boost.Iostreams) &lt;100MB; buffered ifstream for smaller; stdin — all behind UniversalInputStream API">
        Implemented adaptive I/O with single-pass counting pipeline via chained FSMs
      </CVEntry>
      <CVEntry>Created own E2E test suite on top of provided challenge test suite</CVEntry>
    </>
  );
}
